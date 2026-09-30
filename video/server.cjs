const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { renderVideoOnLambda } = require('./lambda-render.cjs');
const { renderVideoLocally } = require('./local-render.cjs');
const { setupExportRoutes } = require('./export-slideshow.cjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow any localhost port (Vite can use 5173, 5174, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    const prodUrl = process.env.FRONTEND_URL;
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === prodUrl) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));  // Increase limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/videos', express.static(path.join(__dirname, 'out')));

// Supabase client
const supabaseUrl = (process.env.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co').trim();
const supabaseKey = (process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0').trim();
const supabase = createClient(supabaseUrl, supabaseKey);

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Video generation server is running' });
});

// Generate video endpoint
app.post('/api/generate-video', upload.single('image'), async (req, res) => {
  try {
    console.log('\n🎬 Video Generation Request Received');

    const { title, subtitle, cameraMovement, cameraPrompt, music, userId } = req.body;
    const cameraText = cameraMovement || cameraPrompt;
    const imagePath = req.file.path;

    console.log(`📸 Image: ${req.file.filename}`);
    console.log(`🎨 Title: ${title}`);
    console.log(`📝 Subtitle: ${subtitle}`);
    console.log(`🎥 Camera: ${cameraText}`);
    console.log(`🎵 Music: ${music}`);

    // Map Railway workaround: Railway blocks AWS_ACCESS_KEY_ID, use REMOTION_ prefix
    if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
      process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
    }

    const region = process.env.AWS_REGION || 'us-east-1';
    const s3Bucket = 'remotionlambda-useast1-1w04idkkha';
    const s3Client = new S3Client({ region });
    const ts = Date.now();

    // Step 1: Upload image to S3 for a reliable public URL (LTX-2 needs to fetch it)
    console.log('📤 Step 1: Uploading image to S3...');
    const imageBuffer = fs.readFileSync(imagePath);
    const s3ImageKey = `images/nismara-pool-${ts}.jpeg`;

    await s3Client.send(new PutObjectCommand({
      Bucket: s3Bucket,
      Key: s3ImageKey,
      Body: imageBuffer,
      ContentType: 'image/jpeg'
    }));

    const imageUrl = `https://${s3Bucket}.s3.${region}.amazonaws.com/${s3ImageKey}`;
    console.log(`✅ Image uploaded to S3: ${imageUrl}`);

    // Step 2: Generate cinematic video with LTX-2
    console.log('🎬 Step 2: Generating cinematic video with LTX-2...');
    let ltxVideoUrl = null;

    try {
      const ltxApiKey = process.env.LTX_API_KEY?.replace(/\s+/g, '');
      if (!ltxApiKey) throw new Error('LTX_API_KEY not set');

      const axios = require('axios');
      const ltxResponse = await axios.post(
        'https://api.ltx.video/v1/image-to-video',
        {
          image_uri: imageUrl,
          prompt: cameraText || 'slow cinematic zoom, luxury villa ambiance, peaceful atmosphere',
          duration: 6,
          resolution: '1920x1080',
          model: 'ltx-2-pro'
        },
        {
          headers: {
            'Authorization': `Bearer ${ltxApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 180000,
          responseType: 'arraybuffer'
        }
      );

      // Save LTX-2 video to disk temporarily
      const ltxLocalPath = path.join(__dirname, 'public', `ltx-video-${ts}.mp4`);
      fs.writeFileSync(ltxLocalPath, ltxResponse.data);
      console.log(`✅ LTX-2 video generated: ${ltxLocalPath}`);

      // Upload LTX-2 video to S3 so Lambda can access it
      const s3LtxKey = `ltx-videos/ltx-${ts}.mp4`;
      await s3Client.send(new PutObjectCommand({
        Bucket: s3Bucket,
        Key: s3LtxKey,
        Body: fs.readFileSync(ltxLocalPath),
        ContentType: 'video/mp4'
      }));

      ltxVideoUrl = `https://${s3Bucket}.s3.${region}.amazonaws.com/${s3LtxKey}`;
      console.log(`✅ LTX-2 video uploaded to S3: ${ltxVideoUrl}`);

      // Clean up local temp file
      fs.unlinkSync(ltxLocalPath);

    } catch (ltxError) {
      console.warn(`⚠️ LTX-2 failed, will use static image: ${ltxError.message}`);
      // ltxVideoUrl remains null → Lambda will use imageUrl (static image fallback)
    }

    // Step 3: Render with Remotion Lambda
    let renderResult;
    let renderMode = 'lambda';

    try {
      console.log('🚀 Step 3: Trying AWS Lambda render...');
      renderResult = await renderVideoOnLambda({
        title,
        subtitle,
        imageUrl,
        ltxVideoUrl,
        musicFile: music || 'bali-sunrise.mp3',
        userId
      });
    } catch (lambdaError) {
      if (lambdaError.message.includes('Rate Exceeded') || lambdaError.message.includes('Concurrency limit')) {
        console.log('⚠️  Lambda quota exceeded, falling back to LOCAL render...');
        renderMode = 'local';
        renderResult = await renderVideoLocally({
          title,
          subtitle,
          imageUrl,
          ltxVideoUrl,
          musicFile: music || 'bali-sunrise.mp3',
          userId
        });
      } else {
        throw lambdaError;
      }
    }

    console.log(`\n🎉 Video generation complete! (mode: ${renderMode})`);
    console.log(`📹 Video URL: ${renderResult.videoUrl}`);
    console.log(`⏱️ Render time: ${renderResult.renderTime}s\n`);

    res.json({
      success: true,
      videoUrl: renderResult.videoUrl,
      renderId: renderResult.renderId,
      renderTime: renderResult.renderTime,
      estimatedCost: renderResult.estimatedCost,
      message: `Video generated successfully (${renderMode === 'local' ? 'local render' : 'AWS Lambda'})`
    });

  } catch (error) {
    console.error('❌ Error generating video:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

setupExportRoutes(app);

// =====================================================
// MuAPI PROXY ENDPOINTS (bypass CORS)
// =====================================================

const MUAPI_BASE_URL = 'https://api.muapi.ai';

/**
 * Generate video clip using MuAPI Veo 3.1 Fast
 * POST /api/muapi/generate-clip
 *
 * Veo 3.1 Fast produces better fluid/water animations than Seedance 2.5
 * Fixed 8-second duration, supports 720p/1080p/4K
 * Pricing: $0.60 (720p), $0.78 (1080p), $1.80 (4K)
 */
app.post('/api/muapi/generate-clip', async (req, res) => {
  try {
    const { imageUrl, prompt, apiKey, resolution = '1080p', aspectRatio = '16:9' } = req.body;

    if (!imageUrl || !prompt || !apiKey) {
      return res.status(400).json({ error: 'Missing required fields: imageUrl, prompt, apiKey' });
    }

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║          SERVER: MUAPI VEO 3.1 PROXY - REQUEST RECEIVED          ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('\n🎬 ===== PROMPT RECEIVED FROM FRONTEND =====');
    console.log(prompt);
    console.log('🎬 ===== END PROMPT =====');
    console.log('📊 Prompt length:', prompt.length, 'characters');
    console.log('🖼️ Image URL:', imageUrl.substring(0, 100) + (imageUrl.length > 100 ? '...' : ''));
    console.log('📐 Resolution:', resolution);
    console.log('📐 Aspect Ratio:', aspectRatio);
    console.log('⏱️ Duration: 8s (fixed by Veo 3.1)');
    console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT PROVIDED');
    console.log('\n📤 Forwarding to MuAPI...\n');

    const axios = require('axios');
    const response = await axios.post(
      `${MUAPI_BASE_URL}/api/v1/veo3.1-fast-image-to-video`,
      {
        prompt,
        image_url: imageUrl,
        resolution,
        duration: 8,
        aspect_ratio: aspectRatio
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        timeout: 30000
      }
    );

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║          SERVER: MUAPI VEO 3.1 RESPONSE RECEIVED                 ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('✅ Request ID:', response.data.request_id || response.data.id || 'N/A');
    console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
    console.log('\n');
    res.json(response.data);

  } catch (error) {
    console.error('❌ MuAPI error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message
    });
  }
});

/**
 * Check video generation status from MuAPI
 * GET /api/muapi/status/:requestId
 */
app.get('/api/muapi/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing x-api-key header' });
    }

    const axios = require('axios');

    // Retry logic with exponential backoff for transient errors
    let lastError = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.get(
          `${MUAPI_BASE_URL}/api/v1/predictions/${requestId}/result`,
          {
            headers: {
              'x-api-key': apiKey
            },
            timeout: 30000 // 30 seconds (increased from 10s)
          }
        );

        console.log(`📊 MuAPI status for ${requestId}:`, response.data.status);
        return res.json(response.data);

      } catch (axiosError) {
        lastError = axiosError;
        const isRetryable = axiosError.code === 'ECONNRESET' ||
                           axiosError.code === 'ETIMEDOUT' ||
                           axiosError.response?.status === 502 ||
                           axiosError.response?.status === 503 ||
                           axiosError.response?.status === 504;

        if (isRetryable && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⚠️ MuAPI status attempt ${attempt} failed (${axiosError.message}), retrying in ${delay/1000}s...`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          throw axiosError;
        }
      }
    }

  } catch (error) {
    console.error('❌ MuAPI status error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Video Generation API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 LTX API Token: ${process.env.LTX_API_KEY ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 REMOTION_AWS_ACCESS_KEY_ID: ${process.env.REMOTION_AWS_ACCESS_KEY_ID ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 AWS_REGION: ${process.env.AWS_REGION || 'NOT SET (default us-east-1)'}\n`);
});

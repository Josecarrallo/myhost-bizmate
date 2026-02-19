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
app.use(express.json());
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
      const ltxApiKey = process.env.LTX_API_KEY;
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

app.listen(PORT, () => {
  console.log(`\n🚀 Video Generation API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 LTX API Token: ${process.env.LTX_API_KEY ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 REMOTION_AWS_ACCESS_KEY_ID: ${process.env.REMOTION_AWS_ACCESS_KEY_ID ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'SET ✅' : 'NOT SET ❌'}`);
  console.log(`🔑 AWS_REGION: ${process.env.AWS_REGION || 'NOT SET (default us-east-1)'}\n`);
});

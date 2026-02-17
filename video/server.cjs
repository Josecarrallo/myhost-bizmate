const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { renderVideoOnLambda } = require('./lambda-render.cjs');
const { renderVideoLocally } = require('./local-render.cjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

    const { title, subtitle, cameraMovement, music, userId } = req.body;
    const imagePath = req.file.path;

    console.log(`📸 Image: ${req.file.filename}`);
    console.log(`🎨 Title: ${title}`);
    console.log(`📝 Subtitle: ${subtitle}`);
    console.log(`🎥 Camera: ${cameraMovement}`);
    console.log(`🎵 Music: ${music}`);

    // Step 1: Upload image to Supabase
    console.log('📤 Step 1: Uploading image to Supabase Storage...');
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = `nismara-pool-${Date.now()}.jpeg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('Nismara Uma Villas')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('Nismara Uma Villas')
      .getPublicUrl(fileName);

    console.log(`✅ Image uploaded: ${publicUrl}`);

    // Step 2: Generate video - try Lambda first, fallback to local
    let renderResult;
    let renderMode = 'lambda';

    try {
      console.log('🚀 Step 2: Trying AWS Lambda render...');
      renderResult = await renderVideoOnLambda({
        title,
        subtitle,
        imageUrl: publicUrl,
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
          imageUrl: publicUrl,
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
  console.log(`🔑 LTX API Token: ${process.env.LTX_API_KEY ? 'SET ✅' : 'NOT SET ❌'}\n`);
});

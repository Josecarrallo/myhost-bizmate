const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

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
const supabaseUrl = process.env.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';
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

    // Step 2: Generate video with LTX-2
    console.log('🚀 Step 2: Generating cinematic video with LTX-2...');

    await new Promise((resolve, reject) => {
      exec(
        `cd "${path.join(__dirname, 'scripts')}" && node image-to-video-cli.mjs "${publicUrl}" "${cameraMovement}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error('❌ LTX-2 Error:', error);
            return reject(error);
          }
          console.log(stdout);
          console.log('✅ LTX-2 video generated');
          resolve();
        }
      );
    });

    // Step 3: Add branding with Remotion
    console.log('🎨 Step 3: Adding branding with Remotion...');

    const propsFile = path.join(__dirname, 'props.json');
    fs.writeFileSync(propsFile, JSON.stringify({
      title,
      subtitle,
      musicFile: music || 'bali-sunrise.mp3'
    }, null, 2));

    console.log(`📝 Props file created: ${JSON.stringify({ title, subtitle, musicFile: music || 'bali-sunrise.mp3' })}`);

    const outputFileName = `video-${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'out', outputFileName);

    await new Promise((resolve, reject) => {
      exec(
        `cd "${__dirname}" && npx remotion render LtxPromo "${outputPath}" --props="${propsFile}"`,
        { maxBuffer: 1024 * 1024 * 10 },
        (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Remotion Error:', error);
            return reject(error);
          }
          console.log('✅ Remotion rendering complete');
          console.log(stdout);
          resolve();
        }
      );
    });

    // Get video file size
    const stats = fs.statSync(outputPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    // Save to Supabase database
    const { data: videoData, error: dbError } = await supabase
      .from('generated_videos')
      .insert([{
        user_id: userId,
        title,
        subtitle,
        video_url: `/videos/${outputFileName}`,
        thumbnail_url: null,
        filename: outputFileName,
        file_size_mb: parseFloat(fileSizeMB),
        duration_seconds: 10,
        resolution: '1920x1080',
        camera_prompt: cameraMovement,
        music_file: music,
        status: 'completed',
        created_at: new Date().toISOString()
      }])
      .select();

    if (dbError) {
      console.error('⚠️ Database save error:', dbError);
    }

    console.log(`\n🎉 Video generation complete!`);
    console.log(`📹 Video URL: /videos/${outputFileName}\n`);

    res.json({
      success: true,
      videoUrl: `/videos/${outputFileName}`,
      message: 'Video generated successfully'
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

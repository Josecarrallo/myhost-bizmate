const { renderMedia, selectComposition } = require('@remotion/renderer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

const supabaseUrl = (process.env.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co').trim();
const supabaseKey = (process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTM5MzQzMiwiZXhwIjoyMDU0OTY5NDMyLCJzY29wZSI6ImFsbCJ9.KHW-rt3AHKjZ_aLyzUbKRxJDQTGCNTx3Xw8MH-uVeJo').trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function renderVideoLocally({ title, subtitle, imageUrl, musicFile, userId }) {
  console.log('🖥️  Starting LOCAL render (Lambda quota exceeded, using local rendering)...');
  console.log(`📝 Title: ${title}`);
  console.log(`🖼️  Image URL: ${imageUrl}`);

  const startTime = Date.now();
  const renderId = `local-${Date.now()}`;
  const outputDir = path.join(__dirname, 'out');
  const outputFile = path.join(outputDir, `${renderId}.mp4`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const serveUrl = 'https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html';

  try {
    console.log('🎬 Selecting composition...');
    const composition = await selectComposition({
      serveUrl,
      id: 'LtxPromo',
      inputProps: {
        title,
        subtitle,
        imageUrl,
        musicFile: musicFile || 'bali-sunrise.mp3'
      }
    });

    console.log(`⚙️  Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);

    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outputFile,
      inputProps: {
        title,
        subtitle,
        imageUrl,
        musicFile: musicFile || 'bali-sunrise.mp3'
      },
      onProgress: ({ renderedFrames, encodedFrames, stitchStage }) => {
        if (renderedFrames % 50 === 0) {
          console.log(`⏳ Rendered: ${renderedFrames}/${composition.durationInFrames} frames`);
        }
      }
    });

    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Local render completed in ${renderTime}s`);

    // Upload to S3
    console.log('📤 Uploading video to S3...');
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const bucketName = 'remotionlambda-useast1-1w04idkkha';
    const s3Key = `${renderId}/out.mp4`;
    const videoBuffer = fs.readFileSync(outputFile);

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: videoBuffer,
      ContentType: 'video/mp4',
      ACL: 'public-read'
    }));

    const videoUrl = `https://${bucketName}.s3.us-east-1.amazonaws.com/${s3Key}`;
    console.log(`🎬 Video URL: ${videoUrl}`);

    // Cleanup local file
    fs.unlinkSync(outputFile);

    // Save to Supabase
    console.log('💾 Saving metadata to Supabase...');
    const { error: dbError } = await supabase
      .from('generated_videos')
      .insert([{
        user_id: userId || null,
        title,
        subtitle,
        video_url: videoUrl,
        thumbnail_url: imageUrl,
        filename: `${renderId}.mp4`,
        file_size_mb: Math.round(videoBuffer.length / 1024 / 1024 * 10) / 10,
        duration_seconds: 6,
        resolution: '1920x1080',
        music_file: musicFile,
        status: 'completed',
        render_time_seconds: parseFloat(renderTime),
        created_at: new Date().toISOString()
      }]);

    if (dbError) {
      console.error('⚠️  Database save error:', dbError);
    } else {
      console.log('✅ Metadata saved to Supabase');
    }

    return {
      videoUrl,
      renderId,
      bucketName,
      renderTime: parseFloat(renderTime),
      estimatedCost: 0,
      success: true
    };

  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    const errorTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ Local render failed after ${errorTime}s:`, error.message);
    throw error;
  }
}

module.exports = { renderVideoLocally };

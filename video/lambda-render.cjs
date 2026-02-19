const { renderMediaOnLambda, getRenderProgress } = require("@remotion/lambda/client");
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co').trim();
const supabaseKey = (process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg').trim();
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Renderiza video usando AWS Lambda + Remotion
 */
async function renderVideoOnLambda({ title, subtitle, imageUrl, ltxVideoUrl, musicFile, userId }) {
  // Railway blocks AWS_ACCESS_KEY_ID env var. Map REMOTION_ prefix to standard AWS SDK vars at runtime.
  if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY && process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY;
  }

  console.log('🚀 Starting AWS Lambda render...');
  console.log(`📝 Title: ${title}`);
  console.log(`📝 Subtitle: ${subtitle}`);
  console.log(`🎬 LTX Video URL: ${ltxVideoUrl || 'NOT SET - using static image'}`);
  console.log(`🖼️ Image URL (fallback): ${imageUrl}`);
  console.log(`🎵 Music: ${musicFile}`);

  const startTime = Date.now();

  try {
    const region = process.env.AWS_REGION || 'us-east-1';
    const functionName = 'remotion-render-4-0-423-mem3008mb-disk10240mb-300sec';
    const serveUrl = 'https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html';

    console.log(`🔧 Lambda Function: ${functionName}`);
    console.log(`🔧 Serve URL: ${serveUrl}`);

    // Renderizar video en Lambda con máxima paralelización (arquitectura correcta)
    const { bucketName, renderId } = await renderMediaOnLambda({
      region,
      functionName,
      serveUrl,
      composition: "LtxPromo",
      inputProps: {
        title,
        subtitle,
        imageUrl,
        ltxVideoUrl: ltxVideoUrl || null,
        musicFile: musicFile || 'bali-sunrise.mp3'
      },
      codec: "h264",
      audioCodec: "mp3",
      imageFormat: "jpeg",
      privacy: "public",
      framesPerLambda: 50,  // 6 chunks (300/50) = parallel rendering = much faster
      concurrencyPerLambda: 2,  // 2 browser tabs per Lambda
      timeoutInMilliseconds: 300000,  // 300s = Lambda function max timeout
      maxRetries: 1,
    });

    console.log(`🔄 Render started, waiting for completion...`);
    console.log(`📹 Bucket: ${bucketName}`);
    console.log(`🆔 Render ID: ${renderId}`);

    // Wait for render to complete (max 8 minutes)
    const MAX_POLL_MS = 8 * 60 * 1000;
    const pollStart = Date.now();
    let progress = await getRenderProgress({ renderId, bucketName, functionName, region });
    while (!progress.done && !progress.fatalErrorEncountered) {
      if (Date.now() - pollStart > MAX_POLL_MS) {
        throw new Error(`Render timeout: Lambda did not complete within 8 minutes. Render ID: ${renderId}`);
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      progress = await getRenderProgress({ renderId, bucketName, functionName, region });
      const pct = (progress.overallProgress * 100).toFixed(1);
      console.log(`⏳ Progress: ${pct}%`);
    }

    if (progress.fatalErrorEncountered) {
      throw new Error(`Render failed: ${progress.errors[0]?.message || 'Unknown error'}`);
    }

    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Lambda render completed in ${renderTime}s`);

    // Construir URL del video
    const videoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/renders/${renderId}/out.mp4`;
    console.log(`🎬 Video URL: ${videoUrl}`);

    // Guardar metadata en Supabase
    console.log('💾 Saving metadata to Supabase...');
    const { data: videoData, error: dbError } = await supabase
      .from('generated_videos')
      .insert([{
        user_id: (userId && userId.trim() !== '') ? userId : null,
        title,
        subtitle,
        video_url: videoUrl,
        thumbnail_url: imageUrl,
        filename: `${renderId}-out.mp4`,
        file_size_mb: 0,
        duration_seconds: 10,
        resolution: '1920x1080',
        camera_prompt: ltxVideoUrl ? 'ltx2-cinematic' : null,
        music_file: musicFile,
        status: 'completed',
        generation_time_seconds: Math.round(parseFloat(renderTime)),
        created_at: new Date().toISOString()
      }])
      .select();

    if (dbError) {
      console.error('⚠️ Database save error:', dbError);
    } else {
      console.log('✅ Metadata saved to Supabase');
    }

    return {
      videoUrl,
      renderId,
      bucketName,
      renderTime: parseFloat(renderTime),
      estimatedCost: 0.05,
      success: true
    };

  } catch (error) {
    const errorTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ Lambda render failed after ${errorTime}s:`, error.message);
    throw error;
  }
}

/**
 * Lambda 2 – Remotion Render Handler
 *
 * Input event:
 *   { jobId, userId, ltxVideoUrl, imageUrl, title, subtitle, musicFile }
 *
 * Output:
 *   { jobId, userId, finalVideoUrl, renderId, renderTime }
 */
exports.handler = async (event) => {
  const { jobId, userId, ltxVideoUrl, imageUrl, title, subtitle, musicFile } = event;
  const result = await renderVideoOnLambda({ title, subtitle, imageUrl, ltxVideoUrl, musicFile, userId });
  return {
    jobId,
    userId,
    finalVideoUrl: result.videoUrl,
    renderId: result.renderId,
    renderTime: result.renderTime
  };
};

module.exports = { renderVideoOnLambda, handler: exports.handler };

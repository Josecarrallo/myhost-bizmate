// =====================================================
// CONTENT STUDIO V2 - SLIDESHOW EXPORT ENDPOINTS
// =====================================================

const exportJobs = new Map();

// Map frontend music tracks to Lambda S3 available files
const LAMBDA_MUSIC_MAP = {
  'ambient': 'bali-sunrise.mp3',
  'upbeat': 'bali-sunrise.mp3',
  'cinematic': 'background-music.mp3',
  'tropical': 'bali-sunrise.mp3',
  'lofi': 'background-music.mp3'
};

function setupExportRoutes(app) {
  app.post('/api/export-slideshow', async (req, res) => {
    try {
      console.log('\n🎬 Slideshow Export Request Received');
      const { scenes, settings, totalDuration, userId } = req.body;

      if (!scenes || scenes.length === 0) {
        return res.status(400).json({ error: 'No scenes provided' });
      }

      console.log(`📸 Scenes: ${scenes.length}`);
      console.log(`⏱️ Duration: ${totalDuration}s`);

      const jobId = `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      exportJobs.set(jobId, { status: 'processing', progress: 0, videoUrl: null, error: null });
      res.json({ jobId, message: 'Export started' });

      // Background processing
      (async () => {
        try {
          if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
            process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
          }
          if (!process.env.AWS_SECRET_ACCESS_KEY && process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
            process.env.AWS_SECRET_ACCESS_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY;
          }

          const region = process.env.AWS_REGION || 'us-east-1';
          const functionName = 'remotion-render-4-0-423-mem3008mb-disk10240mb-300sec';
          const serveUrl = 'https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html';

          exportJobs.get(jobId).progress = 0.1;
          const { renderMediaOnLambda, getRenderProgress } = require("@remotion/lambda/client");

          const { bucketName, renderId } = await renderMediaOnLambda({
            region, functionName, serveUrl,
            composition: "LtxPromo",
            inputProps: {
              title: settings?.text?.title || 'Property Video',
              subtitle: settings?.text?.subtitle || '',
              imageUrl: scenes[0].photoUrl,
              ltxVideoUrl: null,
              musicFile: settings?.music?.enabled ? (LAMBDA_MUSIC_MAP[settings.music.track] || 'bali-sunrise.mp3') : 'bali-sunrise.mp3'
            },
            codec: "h264", audioCodec: "mp3", imageFormat: "jpeg", privacy: "public",
            framesPerLambda: 50, concurrencyPerLambda: 2, timeoutInMilliseconds: 300000, maxRetries: 1,
          });

          exportJobs.get(jobId).progress = 0.2;
          let progress = await getRenderProgress({ renderId, bucketName, functionName, region });
          while (!progress.done && !progress.fatalErrorEncountered) {
            await new Promise(r => setTimeout(r, 2000));
            progress = await getRenderProgress({ renderId, bucketName, functionName, region });
            exportJobs.get(jobId).progress = 0.2 + (progress.overallProgress * 0.7);
          }

          if (progress.fatalErrorEncountered) throw new Error(progress.errors?.[0]?.message || 'Render failed');

          const videoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/renders/${renderId}/out.mp4`;
          exportJobs.get(jobId).status = 'completed';
          exportJobs.get(jobId).progress = 1;
          exportJobs.get(jobId).videoUrl = videoUrl;
          console.log(`✅ Export complete: ${videoUrl}`);
        } catch (error) {
          console.error('❌ Export error:', error.message);
          exportJobs.get(jobId).status = 'failed';
          exportJobs.get(jobId).error = error.message;
        }
      })();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/export-progress/:jobId', (req, res) => {
    const job = exportJobs.get(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ status: job.status, progress: job.progress, videoUrl: job.videoUrl, error: job.error });
  });
}

module.exports = { setupExportRoutes };

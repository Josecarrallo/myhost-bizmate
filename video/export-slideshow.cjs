// =====================================================
// CONTENT STUDIO V2 - SLIDESHOW EXPORT ENDPOINTS
// =====================================================

const exportJobs = new Map();
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Map frontend music tracks to Lambda S3 available files
const LAMBDA_MUSIC_MAP = {
  'ambient': 'bali-sunrise.mp3',
  'upbeat': 'bali-sunrise.mp3',
  'cinematic': 'background-music.mp3',
  'tropical': 'bali-sunrise.mp3',
  'lofi': 'background-music.mp3'
};

// Helper: Upload base64 image to S3
async function uploadBase64ToS3(base64Data, s3Client, bucket, region) {
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) throw new Error('Invalid base64 image format');

  const ext = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const key = `exports/image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: `image/${ext}`
  }));

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

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
          const s3Bucket = 'remotionlambda-useast1-1w04idkkha';
          const functionName = 'remotion-render-4-0-423-mem3008mb-disk10240mb-300sec';
          const serveUrl = 'https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html';

          exportJobs.get(jobId).progress = 0.1;

          // Upload ALL base64 images to S3
          const s3Client = new S3Client({ region });
          const uploadedScenes = [];

          console.log(`📤 Uploading ${scenes.length} images to S3...`);
          for (let i = 0; i < scenes.length; i++) {
            let photoUrl = scenes[i].photoUrl;

            if (photoUrl && photoUrl.startsWith('data:image')) {
              console.log(`📤 Uploading image ${i + 1}/${scenes.length}...`);
              photoUrl = await uploadBase64ToS3(photoUrl, s3Client, s3Bucket, region);
              console.log(`✅ Image ${i + 1} uploaded: ${photoUrl}`);
            }

            uploadedScenes.push({
              photoUrl: photoUrl,
              clipUrl: scenes[i].clipUrl || null,  // Include MuAPI video clip if available
              duration: scenes[i].duration || 4.5
            });

            exportJobs.get(jobId).progress = 0.1 + (0.05 * (i + 1) / scenes.length);
          }

          console.log(`✅ All ${uploadedScenes.length} images uploaded to S3`);
          console.log(`🎬 Scenes with clipUrl:`, uploadedScenes.map((s, i) =>
            `Scene ${i+1}: ${s.clipUrl ? 'HAS VIDEO (' + s.clipUrl.substring(0, 50) + '...)' : 'PHOTO ONLY'}`
          ));
          exportJobs.get(jobId).progress = 0.15;

          const { renderMediaOnLambda, getRenderProgress } = require("@remotion/lambda/client");

          // Select composition based on format
          const format = settings?.format || '9:16';
          let compositionId = 'PropertyPromo'; // Default vertical
          let width = 1080;
          let height = 1920;

          if (format === '16:9') {
            compositionId = 'PropertyPromoHorizontal';
            width = 1920;
            height = 1080;
          } else if (format === '1:1') {
            compositionId = 'PropertyPromoSquare';
            width = 1080;
            height = 1080;
          }

          console.log(`🎬 Using composition: ${compositionId} (${format})`);
          console.log(`🎵 Music settings:`, JSON.stringify(settings?.music, null, 2));
          console.log(`📦 Input props for Lambda:`, JSON.stringify({
            scenesCount: uploadedScenes.length,
            music: settings?.music,
            text: settings?.text,
            format
          }, null, 2));

          // Calculate duration: 30fps, ~4.5 seconds per scene
          const fps = 30;
          const totalDurationSeconds = uploadedScenes.reduce((sum, s) => sum + (s.duration || 4.5), 0);
          const totalFrames = Math.round(totalDurationSeconds * fps);

          const { bucketName, renderId } = await renderMediaOnLambda({
            region, functionName, serveUrl,
            composition: compositionId,  // NEW: Use PropertyPromo, not LtxPromo
            inputProps: {
              scenes: uploadedScenes,
              settings: {
                text: {
                  enabled: settings?.text?.enabled || false,
                  title: settings?.text?.title || '',
                  subtitle: settings?.text?.subtitle || '',
                  position: settings?.text?.position || 'bottom'
                },
                music: {
                  enabled: settings?.music?.enabled !== false,
                  track: settings?.music?.track || 'ambient',
                  volume: settings?.music?.volume || 0.7
                }
              },
              format: format
            },
            durationInFrames: totalFrames,
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

  // Proxy download endpoint to avoid CORS issues
  app.get('/api/download-video/:jobId', async (req, res) => {
    const job = exportJobs.get(req.params.jobId);
    if (!job || !job.videoUrl) {
      return res.status(404).json({ error: 'Video not found' });
    }

    try {
      const https = require('https');
      const url = new URL(job.videoUrl);

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="property-video-${Date.now()}.mp4"`);

      https.get(job.videoUrl, (videoRes) => {
        videoRes.pipe(res);
      }).on('error', (err) => {
        console.error('Download proxy error:', err);
        res.status(500).json({ error: 'Failed to download video' });
      });
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = { setupExportRoutes };

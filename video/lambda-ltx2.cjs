const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const axios = require('axios');
const https = require('https');

/**
 * Lambda 1 – LTX-2 Orchestrator
 *
 * Input event:
 *   { jobId, userId, imageUrl, prompt, options? }
 *   imageUrl must be a public HTTPS URL or an S3 URL already accessible.
 *
 * Output:
 *   { jobId, userId, imageUrlS3, ltxVideoUrl }
 */
exports.handler = async (event) => {
  // Railway blocks AWS_ACCESS_KEY_ID — map REMOTION_ prefix at runtime
  if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
    process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY && process.env.REMOTION_AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = process.env.REMOTION_AWS_SECRET_ACCESS_KEY;
  }

  const { jobId, userId, imageUrl, prompt } = event;

  if (!imageUrl) throw new Error('imageUrl is required');

  const region   = process.env.AWS_REGION || 'us-east-1';
  const s3Bucket = 'remotionlambda-useast1-1w04idkkha';
  const s3Client = new S3Client({ region });
  const ts       = jobId || Date.now();

  // --- Step 1: imageUrl is already in S3 (uploaded by server.cjs before calling this handler)
  // We accept it as-is and pass it to LTX-2.
  const imageUrlS3 = imageUrl;

  console.log(`[LTX2 Lambda] jobId=${jobId} | image=${imageUrlS3}`);
  console.log(`[LTX2 Lambda] prompt="${prompt || '(default)'}"`);

  // --- Step 2: Call LTX-2 API
  const ltxApiKey = process.env.LTX_API_KEY?.replace(/\s+/g, '');
  if (!ltxApiKey) throw new Error('LTX_API_KEY not set');

  console.log('[LTX2 Lambda] Calling LTX-2 API...');
  const ltxResponse = await axios.post(
    'https://api.ltx.video/v1/image-to-video',
    {
      image_uri: imageUrlS3,
      prompt: prompt || 'slow cinematic zoom, luxury villa ambiance, peaceful atmosphere',
      duration: 6,
      resolution: '1920x1080',
      model: 'ltx-2-pro'
    },
    {
      headers: {
        Authorization: `Bearer ${ltxApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 180000,        // 3 min
      responseType: 'arraybuffer'
    }
  );

  console.log('[LTX2 Lambda] LTX-2 video generated, uploading to S3...');

  // --- Step 3: Upload LTX-2 video to S3
  const s3LtxKey = `ltx-videos/ltx-${ts}.mp4`;
  await s3Client.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: s3LtxKey,
    Body: Buffer.from(ltxResponse.data),
    ContentType: 'video/mp4'
  }));

  const ltxVideoUrl = `https://${s3Bucket}.s3.${region}.amazonaws.com/${s3LtxKey}`;
  console.log(`[LTX2 Lambda] Done. ltxVideoUrl=${ltxVideoUrl}`);

  return {
    jobId,
    userId,
    imageUrlS3,
    ltxVideoUrl
  };
};

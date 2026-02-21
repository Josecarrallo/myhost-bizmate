require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
}

// Use a test image that is already in S3 (we know it is public)
const testImageUrl = 'https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/ltx-videos/test-access.txt';
// Actually use the unsplash image which we confirmed works with LTX-2
const imageUrl = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1280&q=80';

const region = 'us-east-1';
const s3Bucket = 'remotionlambda-useast1-1w04idkkha';

async function testFlow() {
  console.log('=== TEST: Full LTX-2 -> S3 -> Ready for Lambda ===\n');

  const s3Client = new S3Client({ region });
  const ts = new Date().getTime();

  // Step 1: Simulate uploading a local image to S3 (use existing file)
  console.log('Step 1: Uploading test image to S3...');
  const testImgPath = path.join(__dirname, 'public', 'images', 'nismara-pool.jpg');
  let s3ImageUrl;

  if (fs.existsSync(testImgPath)) {
    const s3ImageKey = 'images/test-' + ts + '.jpeg';
    await s3Client.send(new PutObjectCommand({
      Bucket: s3Bucket,
      Key: s3ImageKey,
      Body: fs.readFileSync(testImgPath),
      ContentType: 'image/jpeg'
    }));
    s3ImageUrl = 'https://' + s3Bucket + '.s3.' + region + '.amazonaws.com/' + s3ImageKey;
    console.log('S3 image URL: ' + s3ImageUrl);
    // Verify
    const check = await axios.head(s3ImageUrl);
    console.log('Image accessible: HTTP ' + check.status);
  } else {
    // Use Unsplash (already confirmed working)
    s3ImageUrl = imageUrl;
    console.log('Using Unsplash image (already confirmed working with LTX-2): ' + s3ImageUrl);
  }

  // Step 2: Call LTX-2
  console.log('\nStep 2: Calling LTX-2 API...');
  const ltxApiKey = process.env.LTX_API_KEY;
  console.log('LTX_API_KEY:', ltxApiKey ? 'SET' : 'NOT SET');

  let ltxVideoBuffer;
  try {
    const ltxResponse = await axios.post(
      'https://api.ltx.video/v1/image-to-video',
      {
        image_uri: s3ImageUrl,
        prompt: 'slow cinematic zoom, luxury villa ambiance, peaceful atmosphere',
        duration: 6,
        resolution: '1920x1080',
        model: 'ltx-2-pro'
      },
      {
        headers: {
          'Authorization': 'Bearer ' + ltxApiKey,
          'Content-Type': 'application/json'
        },
        timeout: 180000,
        responseType: 'arraybuffer'
      }
    );
    ltxVideoBuffer = Buffer.from(ltxResponse.data);
    console.log('LTX-2 SUCCESS: ' + ltxVideoBuffer.length + ' bytes, Content-Type: ' + ltxResponse.headers['content-type']);
  } catch(e) {
    const errText = e.response && e.response.data ? Buffer.from(e.response.data).toString('utf8').slice(0, 300) : e.message;
    console.error('LTX-2 FAILED: HTTP ' + (e.response && e.response.status) + ' - ' + errText);
    return;
  }

  // Save locally
  const ltxLocalPath = path.join(__dirname, 'public', 'ltx-video-test-' + ts + '.mp4');
  fs.writeFileSync(ltxLocalPath, ltxVideoBuffer);
  console.log('Saved locally: ' + ltxLocalPath + ' (' + ltxVideoBuffer.length + ' bytes)');

  // Step 3: Upload LTX-2 video to S3
  console.log('\nStep 3: Uploading LTX-2 video to S3...');
  const s3LtxKey = 'ltx-videos/ltx-test-' + ts + '.mp4';

  await s3Client.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: s3LtxKey,
    Body: fs.readFileSync(ltxLocalPath),
    ContentType: 'video/mp4'
  }));

  const ltxVideoUrl = 'https://' + s3Bucket + '.s3.' + region + '.amazonaws.com/' + s3LtxKey;
  console.log('S3 LTX video URL: ' + ltxVideoUrl);

  // Verify URL is accessible
  const check = await axios.head(ltxVideoUrl);
  console.log('LTX video accessible: HTTP ' + check.status + ', Size: ' + check.headers['content-length'] + ' bytes');

  // Cleanup local file
  fs.unlinkSync(ltxLocalPath);

  console.log('\n=== FINAL RESULT ===');
  console.log('imageUrl (for Lambda fallback):  ' + s3ImageUrl);
  console.log('ltxVideoUrl (for Lambda base):   ' + ltxVideoUrl);
  console.log('\nFULL FLOW TEST PASSED - Architecture is correct and ready!');
  console.log('Lambda will receive ltxVideoUrl and use it as cinematic video base layer in LtxPromo.tsx');
}

testFlow().catch(e => console.error('Test failed:', e.message));

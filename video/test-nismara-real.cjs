require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
}

const region = 'us-east-1';
const s3Bucket = 'remotionlambda-useast1-1w04idkkha';

// Real Nismara image path
const nismaraImagePath = path.join(
  __dirname, '..',
  'NISMARA UMA PLAN MYHOST BIZMATE',
  'WhatsApp Image 2026-02-18 at 10.25.55 AM.jpeg'
);

async function testNismara() {
  console.log('=== TEST REAL: Imagen Nismara Uma Villa ===\n');

  if (!fs.existsSync(nismaraImagePath)) {
    console.error('ERROR: Image not found at:', nismaraImagePath);
    return;
  }

  const imageSize = fs.statSync(nismaraImagePath).size;
  console.log('Image found:', nismaraImagePath);
  console.log('Image size:', imageSize, 'bytes');

  const s3Client = new S3Client({ region });
  const ts = new Date().getTime();

  // Step 1: Upload real Nismara image to S3
  console.log('\nStep 1: Uploading real Nismara image to S3...');
  const s3ImageKey = 'images/nismara-real-' + ts + '.jpeg';

  await s3Client.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: s3ImageKey,
    Body: fs.readFileSync(nismaraImagePath),
    ContentType: 'image/jpeg'
  }));

  const imageUrl = 'https://' + s3Bucket + '.s3.' + region + '.amazonaws.com/' + s3ImageKey;
  console.log('S3 Image URL: ' + imageUrl);

  const checkImg = await axios.head(imageUrl);
  console.log('Image accessible: HTTP ' + checkImg.status + ', Size: ' + checkImg.headers['content-length'] + ' bytes');

  // Step 2: Call LTX-2 with Nismara image
  console.log('\nStep 2: Calling LTX-2 with Nismara image...');
  const ltxApiKey = process.env.LTX_API_KEY;

  let ltxVideoBuffer;
  const ltxStart = Date.now();

  try {
    const ltxResponse = await axios.post(
      'https://api.ltx.video/v1/image-to-video',
      {
        image_uri: imageUrl,
        prompt: 'slow cinematic zoom out, tropical garden, luxury Bali villa, peaceful morning light, lush vegetation',
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
    const ltxTime = ((Date.now() - ltxStart) / 1000).toFixed(1);
    ltxVideoBuffer = Buffer.from(ltxResponse.data);
    console.log('LTX-2 SUCCESS in ' + ltxTime + 's: ' + ltxVideoBuffer.length + ' bytes (' + (ltxVideoBuffer.length / 1024 / 1024).toFixed(1) + ' MB)');
    console.log('Content-Type: ' + ltxResponse.headers['content-type']);
  } catch(e) {
    const errText = e.response && e.response.data ? Buffer.from(e.response.data).toString('utf8').slice(0, 500) : e.message;
    console.error('LTX-2 FAILED: HTTP ' + (e.response && e.response.status) + ' - ' + errText);
    return;
  }

  // Step 3: Save locally to preview
  const ltxLocalPath = path.join(__dirname, 'public', 'nismara-ltx2-' + ts + '.mp4');
  fs.writeFileSync(ltxLocalPath, ltxVideoBuffer);
  console.log('\nSaved locally for preview: ' + ltxLocalPath);

  // Step 4: Upload LTX-2 video to S3
  console.log('\nStep 3: Uploading LTX-2 video to S3...');
  const s3LtxKey = 'ltx-videos/nismara-ltx2-' + ts + '.mp4';

  await s3Client.send(new PutObjectCommand({
    Bucket: s3Bucket,
    Key: s3LtxKey,
    Body: fs.readFileSync(ltxLocalPath),
    ContentType: 'video/mp4'
  }));

  const ltxVideoUrl = 'https://' + s3Bucket + '.s3.' + region + '.amazonaws.com/' + s3LtxKey;
  const checkVideo = await axios.head(ltxVideoUrl);
  console.log('LTX video accessible: HTTP ' + checkVideo.status + ', Size: ' + checkVideo.headers['content-length'] + ' bytes');

  console.log('\n=== RESULTADO FINAL ===');
  console.log('Imagen original S3:  ' + imageUrl);
  console.log('Video LTX-2 S3:      ' + ltxVideoUrl);
  console.log('Video local preview: ' + ltxLocalPath);
  console.log('\nTODO CORRECTO - Listo para pasar ltxVideoUrl a Lambda/Remotion');
}

testNismara().catch(e => console.error('Test failed:', e.message));

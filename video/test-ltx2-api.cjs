require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Use an existing public image URL from Supabase
const testImageUrl = 'https://jjpscimtxrudtepzwhag.supabase.co/storage/v1/object/public/Nismara Uma Villas/nismara-pool-1739770226234.jpeg';

async function testLtx2() {
  const ltxApiKey = process.env.LTX_API_KEY;
  console.log('LTX_API_KEY:', ltxApiKey ? 'SET ✅' : 'NOT SET ❌');
  
  if (!ltxApiKey) {
    console.log('Cannot test - no API key');
    return;
  }

  console.log('\n🎬 Testing LTX-2 API call...');
  console.log('Image URL:', testImageUrl);
  
  try {
    const response = await axios.post(
      'https://api.ltx.video/v1/image-to-video',
      {
        image_uri: testImageUrl,
        prompt: 'slow cinematic zoom, luxury villa ambiance',
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

    console.log('\n✅ Response received!');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Response size (bytes):', response.data.byteLength || response.data.length);
    
    // Check if it's actually a video
    const firstBytes = Buffer.from(response.data).slice(0, 8);
    console.log('First bytes (hex):', firstBytes.toString('hex'));
    // MP4 starts with 00 00 00 XX 66 74 79 70 (ftyp box)
    const isMp4 = firstBytes[4] === 0x66 && firstBytes[5] === 0x74; // 'ft'
    console.log('Is MP4?', isMp4 ? '✅ YES' : '❓ Check manually');
    
    // Save to verify
    const outPath = path.join(__dirname, 'public', 'ltx-test-output.mp4');
    fs.writeFileSync(outPath, Buffer.from(response.data));
    console.log('\n✅ Saved to:', outPath);
    console.log('File size:', fs.statSync(outPath).size, 'bytes');

  } catch (error) {
    console.error('\n❌ LTX-2 call failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    if (error.response?.data) {
      const errText = Buffer.from(error.response.data).toString('utf8').slice(0, 500);
      console.error('Response body:', errText);
    }
  }
}

testLtx2();

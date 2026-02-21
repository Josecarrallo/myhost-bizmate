require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Use a reliable public image
const testImageUrl = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1280&q=80';

async function testLtx2() {
  const ltxApiKey = process.env.LTX_API_KEY;
  console.log('LTX_API_KEY:', ltxApiKey ? 'SET ✅' : 'NOT SET ❌');
  
  console.log('\n🎬 Testing LTX-2 API call with public image...');
  
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
    console.log('Response size (bytes):', response.data.byteLength || Buffer.from(response.data).length);
    
    const buf = Buffer.from(response.data);
    const firstBytes = buf.slice(0, 12);
    console.log('First bytes (hex):', firstBytes.toString('hex'));
    
    const outPath = path.join(__dirname, 'public', 'ltx-test-output.mp4');
    fs.writeFileSync(outPath, buf);
    console.log('✅ Saved to:', outPath, '| Size:', fs.statSync(outPath).size, 'bytes');

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

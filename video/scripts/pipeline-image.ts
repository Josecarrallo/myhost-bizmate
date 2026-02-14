/**
 * LTX-2 Image-to-Video Pipeline
 * Generates video from a source image with camera movement
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate video from image
 * @param imageUrl - Public URL of the source image
 * @param prompt - Optional text prompt to guide the video generation
 * @returns Path to downloaded video file
 */
export async function runImageToVideo(imageUrl: string, prompt?: string): Promise<string> {
  console.log('\n🎬 LTX-2 Image-to-Video Pipeline Starting...\n');
  console.log(`🖼️  Image URL: ${imageUrl}`);
  if (prompt) console.log(`📝 Prompt: "${prompt}"`);
  console.log('');

  // Check API token
  const apiToken = process.env.LTX_API_TOKEN;
  if (!apiToken) {
    throw new Error(
      '❌ LTX_API_TOKEN not found!\n' +
      'Please set it with: setx LTX_API_TOKEN "your_token_here"'
    );
  }

  console.log('🔧 LTX API client initialized');
  console.log('🎥 Calling LTX-2 Pro API (image-to-video)...\n');

  try {
    // Call LTX-2 Pro API for image-to-video
    const requestBody: any = {
      image_uri: imageUrl,
      model: 'ltx-2-pro',
      duration: 6,
      resolution: '1920x1080',
      generate_audio: true
    };

    // Add prompt if provided
    if (prompt) {
      requestBody.prompt = prompt;
    }

    const response = await axios.post(
      'https://api.ltx.video/v1/image-to-video',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 180000, // 3 minutes
      }
    );

    console.log('✅ LTX-2 generation complete!');
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📦 Content-Type: ${response.headers['content-type']}`);

    // Save to public folder
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, 'ltx-video.mp4');
    fs.writeFileSync(outputPath, response.data);

    console.log('✅ LTX-2 Clip Ready: public/ltx-video.mp4');
    console.log(`📊 File size: ${(response.data.length / 1024 / 1024).toFixed(2)} MB\n`);

    return outputPath;

  } catch (error: any) {
    console.error('\n❌ Pipeline Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data?.toString() || 'No data');
    }
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Usage: node pipeline-image.js <image-url> [prompt]');
    console.error('Example: node pipeline-image.js "https://..." "slow zoom in, cinematic"');
    process.exit(1);
  }

  const imageUrl = args[0];
  const prompt = args.slice(1).join(' ') || undefined;

  console.log('🎬 LTX-2 Image-to-Video Pipeline - CLI Mode\n');

  runImageToVideo(imageUrl, prompt)
    .then((outputPath) => {
      console.log('\n🎉 SUCCESS!');
      console.log(`📹 Video ready at: ${outputPath}`);
      console.log('\n📦 Next step: Run Remotion render to create final branded video');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 FAILED:', error.message);
      process.exit(1);
    });
}

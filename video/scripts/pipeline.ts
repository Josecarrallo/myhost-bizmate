/**
 * LTX-2 Video Generation Pipeline
 * Calls LTX-2 API directly for video generation
 * Downloads cinematic clips with audio for Remotion compositions
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main pipeline function
 * @param prompt - Text prompt for LTX-2 to generate video
 * @returns Path to downloaded video file
 */
export async function runPipeline(prompt: string): Promise<string> {
  console.log('\n🎬 LTX-2 Pipeline Starting...\n');
  console.log(`📝 Prompt: "${prompt}"\n`);

  // 1. Check API token
  const apiToken = process.env.LTX_API_TOKEN;
  if (!apiToken) {
    throw new Error(
      '❌ LTX_API_TOKEN not found!\n' +
      'Please set it with: setx LTX_API_TOKEN "your_token_here"'
    );
  }

  console.log('🔧 LTX API client initialized');
  console.log('🎥 Calling LTX-2 Pro API...\n');

  try {
    // 2. Call LTX-2 Pro API directly
    const response = await axios.post(
      'https://api.ltx.video/v1/text-to-video',
      {
        prompt: prompt,
        model: 'ltx-2-pro',
        duration: 6, // 6 seconds
        resolution: '1920x1080',
        audio: true,
        audio_prompt: 'ambient luxury villa sounds, peaceful atmosphere, gentle background music'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer', // Receive video as binary
        timeout: 180000, // 3 minutes timeout for video generation
      }
    );

    console.log('✅ LTX-2 generation complete!');
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📦 Content-Type: ${response.headers['content-type']}`);

    // 3. Save to public folder
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
  const promptArg = args.join(' ') || 'A cinematic shot of a private pool villa in Ubud rice fields at sunset, golden hour lighting, aerial drone view, lush tropical vegetation, peaceful atmosphere';

  console.log('🎬 LTX-2 Pipeline - CLI Mode\n');

  runPipeline(promptArg)
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

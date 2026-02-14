/**
 * Upload image to Supabase Storage
 * Returns public URL for LTX-2 image-to-video
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(imagePath) {
  console.log('\n📤 Uploading to Supabase Storage...\n');

  // Read the image file
  const imageBuffer = fs.readFileSync(imagePath);
  const fileName = `nismara-pool-${Date.now()}.jpeg`;

  console.log(`📁 File: ${path.basename(imagePath)}`);
  console.log(`📊 Size: ${(imageBuffer.length / 1024).toFixed(2)} KB\n`);

  try {
    // Upload to Supabase Storage in 'Nismara Uma Villas' bucket
    const { data, error } = await supabase.storage
      .from('Nismara Uma Villas')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('Nismara Uma Villas')
      .getPublicUrl(fileName);

    console.log('✅ Upload successful!');
    console.log(`🔗 Public URL: ${publicUrl}\n`);

    return publicUrl;

  } catch (error) {
    console.error('\n❌ Upload failed:', error.message);
    throw error;
  }
}

// CLI execution
const imagePath = process.argv[2] || path.join(__dirname, '..', 'public', 'nismara', 'WhatsApp Image 2026-01-28 at 7.39.12 AM (5).jpeg');

if (!fs.existsSync(imagePath)) {
  console.error(`❌ Image not found: ${imagePath}`);
  process.exit(1);
}

uploadImage(imagePath)
  .then((url) => {
    console.log('🎉 Ready for LTX-2!');
    console.log(`Use this URL: ${url}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error.message);
    process.exit(1);
  });

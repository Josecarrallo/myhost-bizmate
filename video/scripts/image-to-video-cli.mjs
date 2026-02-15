#!/usr/bin/env node

/**
 * LTX-2 Image-to-Video CLI Wrapper
 * Bridges server.cjs with pipeline-image.ts
 */

import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get arguments
const imageUrl = process.argv[2];
const cameraMovement = process.argv[3];

// Validate
if (!imageUrl) {
  console.error('❌ Error: imageUrl required');
  process.exit(1);
}

console.log('🎬 LTX-2 Wrapper Starting...');
console.log(`📸 Image: ${imageUrl}`);

// Build command
const pipelineScript = join(__dirname, 'pipeline-image.ts');

// CRITICAL: Always provide a prompt - if undefined/empty, use default
let promptToUse;
if (cameraMovement && cameraMovement !== 'undefined' && cameraMovement.trim() !== '') {
  promptToUse = cameraMovement;
  console.log(`🎥 Camera: ${cameraMovement}`);
} else {
  promptToUse = 'cinematic camera movement, smooth and professional';
  console.log(`ℹ️  Using default prompt: ${promptToUse}`);
}

let command = `npx ts-node "${pipelineScript}" "${imageUrl}" "${promptToUse}"`;

console.log(`\n🔧 Executing: ${command}\n`);

// Execute
exec(command, (error, stdout, stderr) => {
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  if (error) {
    console.error(`\n❌ Wrapper failed with exit code ${error.code}`);
    process.exit(error.code || 1);
  }

  console.log('\n✅ Wrapper completed successfully');
  process.exit(0);
});

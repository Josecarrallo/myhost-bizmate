require('dotenv').config();
const { execSync } = require('child_process');

if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
}

console.log('Deploying Remotion site to Lambda S3...');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');

try {
  const result = execSync(
    'npx remotion lambda sites create --site-name=myhost-bizmate-video',
    {
      cwd: __dirname,
      env: process.env,
      stdio: 'inherit',
      timeout: 300000
    }
  );
  console.log('Deploy complete!');
} catch(e) {
  console.error('Deploy failed:', e.message);
  process.exit(1);
}

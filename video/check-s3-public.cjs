require('dotenv').config();
const { S3Client, GetBucketAclCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
}
const s3 = new S3Client({ region: 'us-east-1' });

// Test: upload a small test file WITHOUT ACL and see if it's accessible
async function test() {
  const testKey = 'ltx-videos/test-access.txt';
  try {
    await s3.send(new PutObjectCommand({
      Bucket: 'remotionlambda-useast1-1w04idkkha',
      Key: testKey,
      Body: 'test',
      ContentType: 'text/plain'
      // NO ACL - see if this works
    }));
    console.log('✅ Upload WITHOUT ACL: SUCCESS');
    console.log('URL:', `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/${testKey}`);
  } catch(e) {
    console.log('❌ Upload WITHOUT ACL FAILED:', e.message);
  }

  // Also test WITH ACL to confirm it fails
  try {
    await s3.send(new PutObjectCommand({
      Bucket: 'remotionlambda-useast1-1w04idkkha',
      Key: 'ltx-videos/test-acl.txt',
      Body: 'test',
      ContentType: 'text/plain',
      ACL: 'public-read'
    }));
    console.log('✅ Upload WITH ACL: SUCCESS (ACLs are enabled)');
  } catch(e) {
    console.log('⚠️ Upload WITH ACL failed (expected):', e.message);
  }
}

test();

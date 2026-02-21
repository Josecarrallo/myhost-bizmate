const { S3Client, HeadObjectCommand, GetBucketPolicyCommand, GetObjectAclCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET = 'remotionlambda-useast1-1w04idkkha';
const KEY = 'kc37ncohxr/out.mp4';

async function check() {
  console.log('Checking file:', KEY);

  // 1. Does the file exist?
  try {
    const head = await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: KEY }));
    console.log('✅ File EXISTS - Size:', head.ContentLength, 'bytes, Type:', head.ContentType);
  } catch(e) {
    console.log('❌ File HEAD error:', e.name, e.message);
  }

  // 2. What is the ACL on the file?
  try {
    const acl = await client.send(new GetObjectAclCommand({ Bucket: BUCKET, Key: KEY }));
    console.log('ACL Grants:', JSON.stringify(acl.Grants, null, 2));
  } catch(e) {
    console.log('ACL error:', e.name, e.message);
  }

  // 3. What is the bucket policy?
  try {
    const policy = await client.send(new GetBucketPolicyCommand({ Bucket: BUCKET }));
    console.log('Bucket Policy:', policy.Policy);
  } catch(e) {
    console.log('Policy error:', e.name, e.message);
  }
}

check();

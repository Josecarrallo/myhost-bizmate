require('dotenv').config();
const { S3Client, GetBucketPolicyStatusCommand } = require('@aws-sdk/client-s3');
if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
}
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
const s3 = new S3Client({ region: 'us-east-1' });
s3.send(new GetBucketPolicyStatusCommand({ Bucket: 'remotionlambda-useast1-1w04idkkha' }))
  .then(r => console.log('Policy status:', JSON.stringify(r.PolicyStatus)))
  .catch(e => console.log('Policy error:', e.message));

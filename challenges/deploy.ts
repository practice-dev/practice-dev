import { deployChallenges } from '@pvd/tools';

const API_URL = process.env.API_URL!;
const API_TOKEN = process.env.API_TOKEN!;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;

if (!API_URL) {
  throw new Error('API_URL is not defined');
}

if (!API_TOKEN) {
  throw new Error('API_TOKEN is not defined');
}

if (!S3_BUCKET_NAME) {
  throw new Error('S3_BUCKET_NAME is not defined');
}

deployChallenges({
  basedir: __dirname,
  apiToken: API_TOKEN,
  apiUrl: API_URL,
  s3BucketName: S3_BUCKET_NAME,
}).catch(e => {
  console.log(e.stack);
  process.exit(1);
});

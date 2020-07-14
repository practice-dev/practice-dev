import Path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { md5, uploadS3 } from './helper';

export async function uploadAsset(path: string) {
  const ext = Path.extname(path);
  if (!ext) {
    throw new Error('No extension');
  }
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME is not defined');
  }
  const contentType = mime.lookup(path);
  if (!contentType) {
    throw new Error('Cannot get content type');
  }
  const name = Path.basename(path, ext);
  const content = fs.readFileSync(path);
  const hash = md5(content);
  const s3Key = `assets/${name}.${hash}${ext}`;
  await uploadS3({
    content: content,
    contentType,
    bucketName: process.env.S3_BUCKET_NAME,
    s3Key,
  });

  return 'https://practice.dev/' + s3Key;
}

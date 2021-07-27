import AWS, { S3 } from 'aws-sdk';
import { AwsUploadContentAuth } from './generated';

interface UploadS3Options {
  content: string | Buffer;
  contentType?: string;
  s3Key: string;
}

export class S3Upload {
  private s3: S3;
  private bucketName: string;

  constructor(auth: AwsUploadContentAuth) {
    this.s3 = new AWS.S3({
      credentials: auth.credentials,
    });
    this.bucketName = auth.bucketName;
  }

  async upload(options: UploadS3Options) {
    const { content, contentType, s3Key } = options;
    const exists = await this.s3
      .headObject({
        Bucket: this.bucketName,
        Key: s3Key,
      })
      .promise()
      .then(
        () => true,
        err => {
          if (err.code === 'NotFound') {
            return false;
          }
          throw err;
        }
      );

    if (!exists) {
      await this.s3
        .upload({
          Bucket: this.bucketName,
          Key: s3Key,
          Body: content,
          ContentType: contentType,
          ContentLength: content.length,
        })
        .promise();
    }

    return s3Key;
  }
}

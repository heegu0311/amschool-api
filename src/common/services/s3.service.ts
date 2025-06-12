import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = process.env.AWS_S3_BUCKET_NAME || '';

    this.s3 = new AWS.S3({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    fileName?: string,
  ): Promise<string> {
    const key = `${folder}${Date.now()}-${fileName}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
      .promise();

    return uploadResult.Location;
  }

  async deleteFile(url: string): Promise<void> {
    const key = url.split('/').pop();
    const dir = url.split('/')[3];
    if (!key) return;

    await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key: `${dir}/${key}`,
      })
      .promise();
  }

  async getPresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    });
  }
}

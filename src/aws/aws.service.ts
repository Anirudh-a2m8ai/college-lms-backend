import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
  ) {}

  async getPresignedUrl(fileKey: string, contentType: string) {
    try {
      console.log(this.configService.get<string>('aws.bucketName'));
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('aws.bucketName'),
        Key: fileKey,
        ContentType: contentType,
      });
      console.log(command);
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: 3600,
        unhoistableHeaders: new Set(['x-amz-checksum-crc32']),
      });
      return url;
    } catch (error) {
      throw error;
    }
  }

  async getObjectUrl(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('aws.bucketName'),
      Key: fileKey,
    });
    const url = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });
    return {
      url,
      Key: fileKey,
    };
  }
}

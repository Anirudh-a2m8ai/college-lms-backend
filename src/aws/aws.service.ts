import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('S3_CLIENT') private readonly s3: S3Client,
  ) {}

  async getPresignedUrl(fileKey: string, contentType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('aws.bucketName'),
        Key: fileKey,
        ContentType: contentType,
      });
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
      ResponseContentDisposition: 'inline',
      ResponseContentType: 'video/mp4',
    });
    const url = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });
    return {
      url,
      Key: fileKey,
    };
  }

  async startMultipartUpload(fileKey: string, contentType: string) {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.configService.get<string>('aws.bucketName'),
      Key: fileKey,
      ContentType: contentType,
    });
    const response = await this.s3.send(command);
    return response.UploadId;
  }

  async getUploadPartUrl(fileKey: string, uploadId: string, partNumber: number) {
    const command = new UploadPartCommand({
      Bucket: this.configService.get<string>('aws.bucketName'),
      Key: fileKey,
      UploadId: uploadId,
      PartNumber: partNumber,
    });
    const url = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });
    return url;
  }

  async completeMultipartUpload(fileKey: string, uploadId: string, parts: { PartNumber: number; ETag: string }[]) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.configService.get<string>('aws.bucketName'),
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
      },
    });
    const response = await this.s3.send(command);
    return response;
  }

  async abortMultipartUpload(fileKey: string, uploadId: string) {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.configService.get<string>('aws.bucketName'),
      Key: fileKey,
      UploadId: uploadId,
    });
    const response = await this.s3.send(command);
    return response;
  }
}

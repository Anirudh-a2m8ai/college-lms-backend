import { Module, Global } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AwsService } from './aws.service';

@Global()
@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.getOrThrow<string>('aws.region'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('aws.accessKeyId'),
            secretAccessKey: configService.getOrThrow<string>('aws.secretAccessKey'),
          },
          requestChecksumCalculation: 'WHEN_REQUIRED',
        });
      },
      inject: [ConfigService],
    },
    AwsService,
  ],
  exports: ['S3_CLIENT', AwsService],
})
export class AwsModule {}

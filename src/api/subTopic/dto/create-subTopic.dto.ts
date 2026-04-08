import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}

export class UpdateSubTopicDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}

export class GetUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;
}

export class ConfirmUploadDto {
  @IsString()
  @IsNotEmpty()
  subTopicId: string;

  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

export class GetUploadPartUrlDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @IsNumber()
  @IsNotEmpty()
  partNumber: number;
}

export class CompleteMultipartUploadDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  uploadId: string;

  @IsArray()
  @IsNotEmpty()
  parts: { PartNumber: number; ETag: string }[];

  @IsString()
  @IsNotEmpty()
  subTopicId: string;
}

export class AbortMultipartUploadDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  uploadId: string;
}

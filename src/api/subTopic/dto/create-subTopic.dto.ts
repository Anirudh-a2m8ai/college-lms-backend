import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}

export class ConfirmUploadDto {
  @IsString()
  @IsNotEmpty()
  subTopicId: string;

  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

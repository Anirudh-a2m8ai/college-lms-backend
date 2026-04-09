import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}

export class UpdateLessonDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}

export class CreateLessonInClassRoomDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  chapterId: string;

  @IsString()
  @IsNotEmpty()
  classRoomId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}

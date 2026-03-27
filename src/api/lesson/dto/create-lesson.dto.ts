import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  overview: string;

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

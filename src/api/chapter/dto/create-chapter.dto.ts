import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChapterDto {
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
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;
}

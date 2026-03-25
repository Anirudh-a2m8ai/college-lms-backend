import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  courseCode?: string;

  @IsString()
  @IsOptional()
  designationId?: string;
}

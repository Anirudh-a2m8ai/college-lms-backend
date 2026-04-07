import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CourseType } from 'src/generated/prisma/enums';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  designationId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsEnum(CourseType)
  @IsNotEmpty()
  type: CourseType;

  @IsString()
  @IsOptional()
  tenantId: string;

  @IsString()
  @IsNotEmpty()
  versionName: string;
}

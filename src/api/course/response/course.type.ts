import { Exclude, Expose, Type } from 'class-transformer';
import { ModuleResponseDto } from 'src/api/module/response/module.type';
import { CourseStatus } from 'src/generated/prisma/enums';

@Exclude()
export class CourseResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  courseCode: string;

  @Expose()
  latestCourseVersionId: string;

  @Expose()
  designationId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ModuleResponseDto)
  module: ModuleResponseDto[];
}

@Exclude()
export class CourseVersionResponseDto {
  @Expose()
  id: string;

  @Expose()
  versionName: string;

  @Expose()
  status: CourseStatus;

  @Expose()
  courseId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ModuleResponseDto)
  module: ModuleResponseDto[];
}

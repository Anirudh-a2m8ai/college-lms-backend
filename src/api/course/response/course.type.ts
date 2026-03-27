import { Exclude, Expose } from 'class-transformer';

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
}

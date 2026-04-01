import { Exclude, Expose, Type } from 'class-transformer';
import { CourseVersionResponseDto } from 'src/api/course/response/course.type';

@Exclude()
export class EnrollmentsResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  courseVersionId: string;

  @Expose()
  totalSubTopics: number;

  @Expose()
  totalQuizzes: number;

  @Expose()
  completedSubTopics: number;

  @Expose()
  completedQuizzes: number;

  @Expose()
  LastAccessedSubTopicId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CourseVersionResponseDto)
  courseVersion: CourseVersionResponseDto;
}

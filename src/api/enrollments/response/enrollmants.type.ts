import { Exclude, Expose } from 'class-transformer';

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
}

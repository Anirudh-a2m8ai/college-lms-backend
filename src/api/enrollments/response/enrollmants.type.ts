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
  totalLessons: number;

  @Expose()
  totalQuizzes: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

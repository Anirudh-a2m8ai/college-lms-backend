import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ExamResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  courseVersionId: string;

  @Expose()
  classRoomId: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

@Exclude()
export class ExamAttemptResponseDto {
  @Expose()
  id: string;

  @Expose()
  examId: string;

  @Expose()
  enrollmentId: string;

  @Expose()
  userId: string;

  @Expose()
  submittedAt: Date;

  @Expose()
  startedAt: Date;

  @Expose()
  status: string;
}

@Exclude()
export class ExamResultResponseDto {
  @Expose()
  id: string;

  @Expose()
  examId: string;

  @Expose()
  enrollmentId: string;

  @Expose()
  userId: string;

  @Expose()
  score: number;

  @Expose()
  percentage: number;

  @Expose()
  evaluation: JSON;

  @Expose()
  status: string;
}

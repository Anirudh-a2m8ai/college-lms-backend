import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class QuizProgressResponseDto {
  @Expose()
  id: string;

  @Expose()
  enrollmentId: string;

  @Expose()
  quizId: string;

  @Expose()
  totalAttempts: number;

  @Expose()
  highScore: number;

  @Expose()
  isCompleted: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

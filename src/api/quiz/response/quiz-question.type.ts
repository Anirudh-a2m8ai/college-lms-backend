import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class QuizQuestionResponseDto {
  @Expose()
  id: string;

  @Expose()
  question: string;

  @Expose()
  questionType: string;

  @Expose()
  questionOptions: string[];

  @Expose()
  quizId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

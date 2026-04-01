import { Exclude, Expose, Type } from 'class-transformer';
import { QuizQuestionResponseDto } from './quiz-question.type';

@Exclude()
export class QuizResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  questionPattern: any;

  @Expose()
  passPercentage: number;

  @Expose()
  timeLimitInSeconds: number;

  @Expose()
  noOfAttempt: number;

  @Expose()
  orderIndex: number;

  @Expose()
  courseVersionId: string;

  @Expose()
  moduleId: string;

  @Expose()
  chapterId: string;

  @Expose()
  lessonId: string;

  @Expose()
  topicId: string;

  @Expose()
  subTopicId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  quizQuestionCount: number;

  @Expose()
  @Type(() => QuizQuestionResponseDto)
  quizQuestions: QuizQuestionResponseDto[];
}

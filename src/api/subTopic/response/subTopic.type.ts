import { Exclude, Expose, Type } from 'class-transformer';
import { QuizResponseDto } from 'src/api/quiz/response/quiz.type';

@Exclude()
export class SubTopicResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  orderIndex: number;

  @Expose()
  topicId: string;

  @Expose()
  @Type(() => QuizResponseDto)
  quiz: QuizResponseDto[];
}

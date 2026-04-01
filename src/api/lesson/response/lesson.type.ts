import { Exclude, Expose, Type } from 'class-transformer';
import { QuizResponseDto } from 'src/api/quiz/response/quiz.type';
import { TopicResponseDto } from 'src/api/topic/response/topic.type';

@Exclude()
export class LessonResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  overview: string;

  @Expose()
  chapterId: string;

  @Expose()
  moduleId: string;

  @Expose()
  orderIndex: number;

  @Expose()
  isNewlyCreated: boolean;

  @Expose()
  oldLessonId: string;

  @Expose()
  @Type(() => TopicResponseDto)
  topic: TopicResponseDto[];

  @Expose()
  @Type(() => QuizResponseDto)
  quiz: QuizResponseDto[];
}

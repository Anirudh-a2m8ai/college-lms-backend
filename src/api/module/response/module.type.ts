import { Exclude, Expose, Type } from 'class-transformer';
import { ChapterResponseDto } from 'src/api/chapter/response/chapter.type';
import { QuizResponseDto } from 'src/api/quiz/response/quiz.type';

@Exclude()
export class ModuleResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  overview: string;

  @Expose()
  orderIndex: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => ChapterResponseDto)
  chapter: ChapterResponseDto[];

  @Expose()
  isNewlyCreated: boolean;

  @Expose()
  oldModuleId: string;

  @Expose()
  @Type(() => QuizResponseDto)
  quiz: QuizResponseDto[];
}

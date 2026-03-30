import { Exclude, Expose, Type } from 'class-transformer';
import { LessonResponseDto } from 'src/api/lesson/response/lesson.type';
import { TopicResponseDto } from 'src/api/topic/response/topic.type';

@Exclude()
export class ChapterResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  moduleId: string;

  @Expose()
  overview: string;

  @Expose()
  orderIndex: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => LessonResponseDto)
  lesson: LessonResponseDto[];
}

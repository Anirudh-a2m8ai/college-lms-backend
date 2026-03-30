import { Exclude, Expose, Type } from 'class-transformer';
import { SubTopicResponseDto } from 'src/api/subTopic/response/subTopic.type';

@Exclude()
export class TopicResponseDto {
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
  lessonId: string;

  @Expose()
  @Type(() => SubTopicResponseDto)
  subTopic: SubTopicResponseDto[];
}

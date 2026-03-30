import { Exclude, Expose } from 'class-transformer';

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
}

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ClassRoomProgressResponseDto {
  @Expose()
  id: string;

  @Expose()
  classRoomId: string;

  @Expose()
  subTopicId: string;

  @Expose()
  status: string;

  @Expose()
  currentTimeStamp: number;

  @Expose()
  startedAt: Date;

  @Expose()
  completedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

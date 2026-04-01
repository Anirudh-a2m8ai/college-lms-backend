import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserProgressResponseDto {
  @Expose()
  id: string;

  @Expose()
  enrollmentId: string;

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
  lastAccessedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

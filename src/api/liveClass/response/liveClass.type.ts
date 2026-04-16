import { Exclude, Expose, Type } from 'class-transformer';
import { ClassRoomResponseDto } from 'src/api/classRoom/response/classRoom.type';

@Exclude()
export class LiveClassResponseDto {
  @Expose()
  id: string;

  @Expose()
  startTime: string;

  @Expose()
  endTime: string;

  @Expose()
  classRoomId: string;

  @Expose()
  hostId: string;

  @Expose()
  status: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  @Expose()
  @Type(() => ClassRoomResponseDto)
  classRoom: ClassRoomResponseDto;
}

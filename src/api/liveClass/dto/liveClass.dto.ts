import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateLiveClassDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @IsNotEmpty()
  @IsString()
  classRoomId: string;

  @IsNotEmpty()
  @IsString()
  hostId: string;
}

export class StartLiveClassDto {
  @IsNotEmpty()
  @IsString()
  liveClassId: string;
}

import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProcessStatus } from 'src/generated/prisma/enums';

export class CreateClassRoomProgressDto {
  @IsString()
  @IsNotEmpty()
  classRoomId: string;

  @IsString()
  @IsNotEmpty()
  subTopicId: string;

  @IsEnum(ProcessStatus)
  @IsNotEmpty()
  status: ProcessStatus;

  @IsNumber()
  @IsNotEmpty()
  currentTimeStamp: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startedAt: Date;
}

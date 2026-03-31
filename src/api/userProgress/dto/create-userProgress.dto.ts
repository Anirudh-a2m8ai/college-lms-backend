import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProcessStatus } from 'src/generated/prisma/enums';

export class CreateUserProgressDto {
  @IsNotEmpty()
  @IsString()
  subTopicId: string;

  @IsNotEmpty()
  @IsString()
  enrollmentId: string;

  @IsEnum(ProcessStatus)
  status: ProcessStatus;

  @IsNotEmpty()
  @IsNumber()
  currentTimeStamp: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt: Date;
}

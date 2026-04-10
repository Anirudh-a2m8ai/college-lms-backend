import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClassRoomStatus } from 'src/generated/prisma/enums';

export class CreateClassRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ClassRoomStatus)
  @IsNotEmpty()
  status: ClassRoomStatus;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  sourceCourseVersionId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
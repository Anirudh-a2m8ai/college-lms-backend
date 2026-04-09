import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  tenantId: string;
}
import { Exclude, Expose, Type } from 'class-transformer';
import { ClassRoomResponseDto } from 'src/api/classRoom/response/classRoom.type';
import { CourseVersionResponseDto } from 'src/api/course/response/course.type';
import { UserResponseDto } from 'src/api/user/response/user.type';

@Exclude()
export class EnrollmentsResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  courseVersionId: string;

  @Expose()
  classRoomId: string;

  @Expose()
  totalSubTopics: number;

  @Expose()
  totalQuizzes: number;

  @Expose()
  completedSubTopics: number;

  @Expose()
  completedQuizzes: number;

  @Expose()
  LastAccessedSubTopicId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  tenantId: string;

  @Expose()
  @Type(() => CourseVersionResponseDto)
  courseVersion: CourseVersionResponseDto;

  @Expose()
  @Type(() => ClassRoomResponseDto)
  classRoom: ClassRoomResponseDto;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}

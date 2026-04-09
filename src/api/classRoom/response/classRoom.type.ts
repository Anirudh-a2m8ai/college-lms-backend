import { Exclude, Expose, Type } from 'class-transformer';
import { ModuleResponseDto } from 'src/api/module/response/module.type';

@Exclude()
export class ClassRoomResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  status: string;

  @Expose()
  courseId: string;

  @Expose()
  sourceCourseVersionId: string;

  @Expose()
  tenantId: string;

  @Expose()
  userId: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => ModuleResponseDto)
  @Expose()
  module: ModuleResponseDto[];
}

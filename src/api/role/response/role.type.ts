import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RoleResponseDto {
  @Expose()
  id: string;

  @Expose()
  role: string;

  @Expose()
  isSystemDefined: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  permissions: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

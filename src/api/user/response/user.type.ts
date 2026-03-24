import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/api/role/response/role.type';
import { SocialType } from 'src/generated/prisma/enums';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  status: string;

  @Expose()
  profilePicture: string;

  @Expose()
  language: string;

  @Expose()
  timezone: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  socialLinks: SocialLinksResponseDto[];

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto[];
}

export class SocialLinksResponseDto {
  @Expose()
  id: string;

  @Expose()
  socialType: SocialType;

  @Expose()
  url: string;
}

export class UserPermissionsResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  tag: string;
}

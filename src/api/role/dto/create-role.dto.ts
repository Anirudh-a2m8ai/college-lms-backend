import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}

export class RolePermissionDto {
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}

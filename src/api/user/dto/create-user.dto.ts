import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AccountStatus, RoleType } from 'src/generated/prisma/enums';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  bio: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class CreateUserBulkDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  roleId: string;

  @IsEnum(AccountStatus)
  @IsOptional()
  status: AccountStatus;

  @IsNotEmpty()
  @IsString()
  passwordHash: string;
}

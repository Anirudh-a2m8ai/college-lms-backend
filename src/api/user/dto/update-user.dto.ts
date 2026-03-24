import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SocialType } from 'src/generated/prisma/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  socialLinks: SocialLinksDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds: string[];
}

export class SocialLinksDto {
  @IsNotEmpty()
  @IsString()
  socialType: SocialType;

  @IsNotEmpty()
  @IsString()
  url: string;
}

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  subdomain: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  website: string;

  @IsString()
  @IsOptional()
  defaultLanguage: string;

  @IsString()
  @IsOptional()
  timezone: string;
}

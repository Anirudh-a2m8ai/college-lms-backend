import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  subdomain: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
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

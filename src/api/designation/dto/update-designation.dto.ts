import { IsOptional, IsString } from 'class-validator';

export class UpdateDesignationDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  tenantId: string;

  @IsString()
  @IsOptional()
  thumbnailUrl: string;
}

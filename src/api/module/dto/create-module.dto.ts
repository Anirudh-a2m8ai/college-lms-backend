import { isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsOptional()
  orderIndex: number;
}

export class UpdateModuleDto extends CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateModuleInClassRoomDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  overview: string;

  @IsString()
  @IsNotEmpty()
  classRoomId: string;

  @IsNumber()
  @IsOptional()
  orderIndex: number;
}


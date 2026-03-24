import { IsOptional, IsString } from 'class-validator';

export class SearchInputDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  per_page: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  search_by: string;

  @IsOptional()
  @IsString()
  sort_by: string;

  @IsOptional()
  @IsString()
  sort_order: string;

  @IsOptional()
  @IsString()
  start_date: string;

  @IsOptional()
  @IsString()
  end_date: string;
}

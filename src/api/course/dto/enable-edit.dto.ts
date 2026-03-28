import { IsNotEmpty, IsString } from 'class-validator';

export class EnableEditDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  versionName: string;
}

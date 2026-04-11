import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuizDifficulty, QuizStatus, QuizType } from 'src/generated/prisma/enums';

export class UpdateQuizDto {
  @IsOptional()
  @IsEnum(QuizStatus)
  status: QuizStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadLine: Date;

  @IsOptional()
  @IsString()
  moduleId: string;

  @IsOptional()
  @IsString()
  chapterId: string;

  @IsOptional()
  @IsString()
  subTopicId: string;

  @IsOptional()
  @IsString()
  topicId: string;

  @IsOptional()
  @IsString()
  lessonId: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isMandatory: boolean;

  @IsOptional()
  @IsEnum(QuizType)
  quizType: QuizType;

  @IsOptional()
  @IsNumber()
  noOfQuestions: number;

  @IsOptional()
  @IsEnum(QuizDifficulty)
  difficulty?: QuizDifficulty;

  @IsOptional()
  @IsNumber()
  passPercentage: number;

  @IsOptional()
  @IsNumber()
  timeLimitInSeconds: number;
}

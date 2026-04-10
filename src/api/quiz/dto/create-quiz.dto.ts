import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Prisma } from 'src/generated/prisma/client';
import { QuizDifficulty, QuizQuestionType, QuizStatus, QuizType } from 'src/generated/prisma/enums';

export class QuestionPatternDto {
  @IsInt()
  @Min(0)
  [QuizQuestionType.MCQ]: number;

  @IsInt()
  @Min(0)
  [QuizQuestionType.MULTI_SELECT]: number;

  @IsInt()
  @Min(0)
  [QuizQuestionType.TRUE_OR_FALSE]: number;

  @IsInt()
  @Min(0)
  [QuizQuestionType.FILL_IN_THE_BLANKS]: number;

  @IsInt()
  @Min(0)
  [QuizQuestionType.SHORT_ANSWER]: number;
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isMandatory: boolean;

  @IsNotEmpty()
  @IsEnum(QuizType)
  quizType: QuizType;

  @IsOptional()
  @IsNumber()
  noOfQuestions: number;

  @IsOptional()
  @IsEnum(QuizDifficulty)
  difficulty?: QuizDifficulty;

  @IsNotEmpty()
  @IsNumber()
  passPercentage: number;

  @IsNotEmpty()
  @IsNumber()
  timeLimitInSeconds: number;

  @IsNotEmpty()
  @IsNumber()
  noOfAttempt: number;

  @IsString()
  @IsOptional()
  lessonId: string;

  @IsString()
  @IsOptional()
  topicId: string;

  @IsString()
  @IsOptional()
  subTopicId: string;

  @IsString()
  @IsOptional()
  chapterId: string;

  @IsString()
  @IsOptional()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  courseVersionId: string;

  @IsNumber()
  @IsNotEmpty()
  orderIndex: number;

  @IsOptional()
  @IsEnum(QuizStatus)
  status: QuizStatus;

  @IsOptional()
  @IsDate()
  deadLine: Date;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => QuestionPatternDto)
  questionPattern?: QuestionPatternDto;
}

export class CreateQuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNotEmpty()
  @IsEnum(QuizQuestionType)
  questionType: QuizQuestionType;

  @IsOptional()
  @IsArray()
  options: string[];

  @IsNotEmpty()
  @IsJSON()
  correctAnswer: Prisma.InputJsonValue;
}

export class QuestionSubmissionDto {
  @IsNotEmpty()
  @IsUUID()
  quizQuestionId: string;

  @IsNotEmpty()
  @IsJSON()
  answer: Prisma.InputJsonValue;
}
export class CreateQuizSubmissionDto {
  @IsNotEmpty()
  @IsUUID()
  quizId: string;

  @IsNotEmpty()
  @IsUUID()
  enrollmentId: string;

  @IsNotEmpty()
  @Type(() => QuestionSubmissionDto)
  quizSubmission: QuestionSubmissionDto[];
}

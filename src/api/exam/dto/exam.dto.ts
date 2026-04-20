import { IsArray, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AttemptStatus, ExamDifficulty, ExamStatus, QuizQuestionType } from 'src/generated/prisma/enums';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  tenantId: string;

  @IsString()
  @IsOptional()
  courseVersionId: string;

  @IsString()
  @IsOptional()
  classRoomId: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @IsNotEmpty()
  timeLimit: number;

  @IsNumber()
  @IsNotEmpty()
  passPercentage: number;

  @IsEnum(ExamDifficulty)
  @IsOptional()
  difficulty: ExamDifficulty;

  @IsEnum(ExamStatus)
  @IsOptional()
  status: ExamStatus;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEnum(QuizQuestionType)
  @IsNotEmpty()
  questionType: QuizQuestionType;

  @IsArray()
  @IsNotEmpty()
  options: string[];

  @IsArray()
  @IsNotEmpty()
  correctAnswer: string[];

  @IsNumber()
  @IsNotEmpty()
  marks: number;
}

export class QuestionSubmissionDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class CreateExamSubmissionDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsString()
  @IsNotEmpty()
  examAttemptId: string;

  @IsString()
  @IsNotEmpty()
  enrollmentId: string;

  @IsEnum(AttemptStatus)
  @IsNotEmpty()
  status: AttemptStatus;

  @IsJSON()
  @IsNotEmpty()
  answers: string;
}

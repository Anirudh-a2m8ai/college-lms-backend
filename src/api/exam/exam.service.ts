import { Injectable } from '@nestjs/common';
import { ExamDbService } from 'src/repository/exam.db-service';
import { CreateExamDto, CreateExamSubmissionDto, CreateQuestionDto } from './dto/exam.dto';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { ClassRoomDbService } from 'src/repository/classRoom.db-service';
import { plainToInstance } from 'class-transformer';
import { ExamAttemptResponseDto, ExamResponseDto } from './response/exam.type';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { ExamQuestionDbService } from 'src/repository/examQuestion.db-service';
import { AttemptStatus, ResultStatus } from 'src/generated/prisma/enums';
import { ExamResultDbService } from 'src/repository/examResult.db-service';
import { ExamAttemptDbService } from 'src/repository/examAttempt.db-service';

@Injectable()
export class ExamService {
  constructor(
    private examDbService: ExamDbService,
    private courseVersionDbService: CourseVersionDbService,
    private classRoomDbService: ClassRoomDbService,
    private examQuestionDbService: ExamQuestionDbService,
    private examAttemptDbService: ExamAttemptDbService,
    private examResultDbService: ExamResultDbService,
  ) {}

  async createExam(body: CreateExamDto, user: any) {
    if (body.courseVersionId) {
      const courseVersion = await this.courseVersionDbService.findUnique({
        where: {
          id: body.courseVersionId,
        },
      });
      if (!courseVersion) {
        throw new Error('Course version not found');
      }
    }
    if (body.classRoomId) {
      const classRoom = await this.classRoomDbService.findUnique({
        where: {
          id: body.classRoomId,
        },
      });
      if (!classRoom) {
        throw new Error('Class room not found');
      }
    }
    if (!body.courseVersionId && !body.classRoomId) {
      throw new Error('Course version or class room is required');
    }
    const exam = await this.examDbService.create({
      data: {
        title: body.title,
        description: body.description,
        courseVersionId: body.courseVersionId,
        classRoomId: body.classRoomId,
        startDate: body.startDate,
        endDate: body.endDate,
        timeLimit: body.timeLimit,
        passPercentage: body.passPercentage,
        difficulty: body.difficulty,
        status: body.status,
        tenantId: body.tenantId,
      },
    });
    const examResponse = plainToInstance(ExamResponseDto, exam);
    return {
      message: 'Exam created successfully',
      data: examResponse,
    };
  }

  async listAll(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    if (user.tenantId) {
      filterInput.tenantId = user.tenantId;
    }

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.examDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.examDbService.count({ where }),
    ]);

    const enrolledClassResponse = plainToInstance(ExamResponseDto, data, {
      excludeExtraneousValues: true,
    });

    const sendData = {
      data: enrolledClassResponse,
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async findOne(id: string, user: any) {
    const exam = await this.examDbService.findUnique({
      where: {
        id,
        tenantId: user.tenantId,
      },
    });
    if (!exam) {
      throw new Error('Exam not found');
    }
    const examResponse = plainToInstance(ExamResponseDto, exam);
    return {
      data: examResponse,
    };
  }

  async listByStudent(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    if (user.tenantId) {
      filterInput.tenantId = user.tenantId;
    }

    filterInput.OR = [
      {
        classRoom: {
          enrollments: {
            some: {
              userId: user.userId,
            },
          },
        },
      },
      {
        courseVersion: {
          enrollments: {
            some: {
              userId: user.userId,
            },
          },
        },
      },
    ];
    const where = FilterMapper(filterInput, query);
    const [data, total] = await Promise.all([
      this.examDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.examDbService.count({ where }),
    ]);

    const enrolledClassResponse = plainToInstance(ExamResponseDto, data, {
      excludeExtraneousValues: true,
    });

    const sendData = {
      data: enrolledClassResponse,
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async createQuestion(body: CreateQuestionDto[], user: any) {
    const exam = await this.examDbService.findFirst({
      where: {
        id: body[0].examId,
        tenantId: user.tenantId,
      },
    });
    if (!exam) {
      throw new Error('Exam not found');
    }
    const question = await this.examQuestionDbService.createManyAndReturn({
      data: body.map((item) => {
        return {
          examId: item.examId,
          question: item.question,
          questionType: item.questionType,
          options: item.options,
          correctAnswer: item.correctAnswer,
          marks: item.marks,
        };
      }),
    });
    const questionResponse = plainToInstance(ExamResponseDto, question);
    return {
      message: 'Question created successfully',
      data: questionResponse,
    };
  }

  async startedExam(body: any, user: any) {
    const exam = await this.examDbService.findFirst({
      where: {
        id: body.examId,
        tenantId: user.tenantId,
      },
    });
    if (!exam) {
      throw new Error('Exam not found');
    }
    const question = await this.examAttemptDbService.create({
      data: {
        examId: body.examId,
        enrollmentId: body.enrollmentId,
        userId: user.userId,
        startedAt: new Date(),
        answers: {},
        status: AttemptStatus.IN_PROGRESS,
      },
    });
    const questionResponse = plainToInstance(ExamAttemptResponseDto, question);
    return {
      message: 'Question created successfully',
      data: questionResponse,
    };
  }

  async submitExam(body: CreateExamSubmissionDto, user: any) {
    const exam = await this.examDbService.findFirst({
      where: {
        id: body.examId,
        tenantId: user.tenantId,
      },
    });
    if (!exam) {
      throw new Error('Exam not found');
    }
    const question = await this.examAttemptDbService.update({
      where: {
        id: body.examAttemptId,
      },
      data: {
        submittedAt: new Date(),
        status: body.status,
        answers: body.answers,
      },
    });
    const findQuestions = await this.examQuestionDbService.findMany({
      where: {
        examId: body.examId,
      },
    });
    let score = 0;
    let totalMarks = 0;
    findQuestions.forEach((question) => {
      if (question.correctAnswer === body.answers[question.id]) {
        score += question.marks;
      }
      totalMarks += question.marks;
    });
    const percentage = (score / totalMarks) * 100;
    const result = await this.examResultDbService.create({
      data: {
        examId: body.examId,
        enrollmentId: body.enrollmentId,
        userId: user.userId,
        score: score,
        percentage: percentage,
        status: percentage >= exam.passPercentage! ? ResultStatus.PASSED : ResultStatus.FAILED,
      },
    });

    const questionResponse = plainToInstance(ExamAttemptResponseDto, question);
    return {
      message: 'Question created successfully',
      data: questionResponse,
    };
  }
}

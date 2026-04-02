import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { CreateEnrollmentDto } from './dto/create-enrollments.dto';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { QuizDbService } from 'src/repository/quiz.db-service';
import { plainToInstance } from 'class-transformer';
import { EnrollmentsResponseDto } from './response/enrollmants.type';
import { SubTopicMapDbService } from 'src/repository/subTopicMap.db-service';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly enrollmentsDbService: EnrollmentsDbService,
    private readonly courseVersionDbService: CourseVersionDbService,
    private readonly quizDbService: QuizDbService,
    private readonly subTopicMapDbService: SubTopicMapDbService,
  ) {}

  async create(payload: CreateEnrollmentDto) {
    const existingEnrollment = await this.enrollmentsDbService.findFirst({
      where: {
        userId: payload.userId,
        courseVersionId: payload.courseVersionId,
      },
    });
    if (existingEnrollment) {
      throw new BadRequestException('Enrollment already exists');
    }
    const courseVersion = await this.courseVersionDbService.findUnique({
      where: {
        id: payload.courseVersionId,
      },
    });
    if (!courseVersion) {
      throw new BadRequestException('Course version not found');
    }
    const totalSubTopics = await this.subTopicMapDbService.count({
      where: {
        courseVersionId: payload.courseVersionId,
      },
    });
    const totalQuizzes = await this.quizDbService.count({
      where: {
        courseVersionId: payload.courseVersionId,
      },
    });
    const enrollment = await this.enrollmentsDbService.create({
      data: {
        userId: payload.userId,
        courseVersionId: payload.courseVersionId,
        totalSubTopics: totalSubTopics,
        totalQuizzes: totalQuizzes,
        tenantId: courseVersion.tenantId,
      },
    });
    const enrollmentResponse = plainToInstance(EnrollmentsResponseDto, enrollment);
    return {
      message: 'Enrollment created successfully',
      data: enrollmentResponse,
    };
  }

  async getAllEnrollments(user: any) {
    const enrollments = await this.enrollmentsDbService.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        courseVersion: {
          include: {
            course: true,
          },
        },
      },
    });
    const enrollmentResponse = plainToInstance(EnrollmentsResponseDto, enrollments);
    return {
      data: enrollmentResponse,
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
      this.enrollmentsDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { user: true, courseVersion: { include: { course: true } } },
      }),
      this.enrollmentsDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(EnrollmentsResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }
}

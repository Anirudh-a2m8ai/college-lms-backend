import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { CreateEnrollmentDto, CreateEnrollmentInCourseVersionDto } from './dto/create-enrollments.dto';
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
import { ClassRoomDbService } from 'src/repository/classRoom.db-service';
import { ClassSubTopicMapDbService } from 'src/repository/classSubtopicMap.db-service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly enrollmentsDbService: EnrollmentsDbService,
    private readonly quizDbService: QuizDbService,
    private readonly classRoomDbService: ClassRoomDbService,
    private readonly classSubTopicMapDbService: ClassSubTopicMapDbService,
    private readonly courseVersionDbService: CourseVersionDbService,
    private readonly subTopicMapDbService: SubTopicMapDbService,
  ) {}

  async create(payload: CreateEnrollmentDto) {
    const existingEnrollment = await this.enrollmentsDbService.findFirst({
      where: {
        userId: payload.userId,
        classRoomId: payload.classRoomId,
      },
    });
    if (existingEnrollment) {
      throw new BadRequestException('Enrollment already exists');
    }
    const classRoom = await this.classRoomDbService.findUnique({
      where: {
        id: payload.classRoomId,
      },
    });
    if (!classRoom) {
      throw new BadRequestException('Class room not found');
    }
    const totalSubTopics = await this.classSubTopicMapDbService.count({
      where: {
        classRoomId: payload.classRoomId,
      },
    });
    const totalQuizzes = await this.quizDbService.count({
      where: {
        classRoomId: classRoom.id,
      },
    });
    const enrollment = await this.enrollmentsDbService.create({
      data: {
        userId: payload.userId,
        classRoomId: payload.classRoomId,
        totalSubTopics: totalSubTopics,
        totalQuizzes: totalQuizzes,
        tenantId: classRoom.tenantId,
        startDate: classRoom.startDate,
        endDate: classRoom.endDate,
      },
    });
    const enrollmentResponse = plainToInstance(EnrollmentsResponseDto, enrollment);
    return {
      message: 'Enrollment created successfully',
      data: enrollmentResponse,
    };
  }

  async createInCourseVersion(payload: CreateEnrollmentInCourseVersionDto) {
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
        courseVersionId: courseVersion.id,
      },
    });
    const enrollment = await this.enrollmentsDbService.create({
      data: {
        userId: payload.userId,
        courseVersionId: payload.courseVersionId,
        totalSubTopics: totalSubTopics,
        totalQuizzes: totalQuizzes,
        tenantId: courseVersion.tenantId,
        startDate: payload.startDate,
        endDate: payload.endDate,
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
        classRoomId: {
          not: null,
        },
      },
      include: {
        classRoom: {
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

  async getAllUserEnrollmentsInCourseVersion(user: any) {
    const enrollments = await this.enrollmentsDbService.findMany({
      where: {
        userId: user.userId,
        courseVersionId: {
          not: null,
        },
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
        include: { user: true, classRoom: { include: { course: true } } },
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

  async getEnrollment(enrollmentId: string) {
    const enrollment = await this.enrollmentsDbService.findUnique({
      where: {
        id: enrollmentId,
      },
      include: {
        classRoom: {
          include: {
            course: true,
          },
        },
        courseVersion: {
          include: {
            course: true,
          },
        },
        user: true,
      },
    });
    const enrollmentResponse = plainToInstance(EnrollmentsResponseDto, enrollment);
    return {
      data: enrollmentResponse,
    };
  }

  async createBulk(payload: CreateEnrollmentDto[]) {
    const classRoom = await this.classRoomDbService.findUnique({
      where: {
        id: payload[0].classRoomId,
      },
    });
    if (!classRoom) {
      throw new BadRequestException('Class room not found');
    }
    const totalSubTopics = await this.classSubTopicMapDbService.count({
      where: {
        classRoomId: payload[0].classRoomId,
      },
    });
    const totalQuizzes = await this.quizDbService.count({
      where: {
        classRoomId: classRoom.id,
      },
    });
    const enrollments = await this.enrollmentsDbService.createMany({
      data: payload.map((item) => {
        return {
          userId: item.userId,
          classRoomId: item.classRoomId,
          totalSubTopics: totalSubTopics,
          totalQuizzes: totalQuizzes,
          tenantId: classRoom.tenantId,
          startDate: classRoom.startDate,
          endDate: classRoom.endDate,
        };
      }),
    });
    const enrollmentResponse = plainToInstance(EnrollmentsResponseDto, enrollments, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'Enrollment created successfully',
      data: enrollmentResponse,
    };
  }

  async getEnrolledClassList(user) {
    const enrolledClasses = await this.enrollmentsDbService.findMany({
      where: {
        userId: user.userId,
        AND: [{ classRoomId: { not: null } }, { classRoomId: { not: '' } }],
      },
      include: {
        classRoom: true,
      },
    });

    const enrolledClassResponse = plainToInstance(EnrollmentsResponseDto, enrolledClasses, {
      excludeExtraneousValues: true,
    });

    return {
      message: 'Enrolled class list fetched successfully',
      data: enrolledClassResponse,
    };
  }
}

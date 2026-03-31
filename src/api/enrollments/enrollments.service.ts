import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { CreateEnrollmentDto } from './dto/create-enrollments.dto';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { QuizDbService } from 'src/repository/quiz.db-service';
import { plainToInstance } from 'class-transformer';
import { EnrollmentsResponseDto } from './response/enrollmants.type';
import { SubTopicMapDbService } from 'src/repository/subTopicMap.db-service';

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
        userId: user.id,
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
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { CreateEnrollmentDto } from './dto/create-enrollments.dto';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { LessonMapDbService } from 'src/repository/lessonMap.db-service';
import { QuizDbService } from 'src/repository/quiz.db-service';
import { plainToInstance } from 'class-transformer';
import { EnrollmentsResponseDto } from './response/enrollmants.type';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly enrollmentsDbService: EnrollmentsDbService,
    private readonly courseVersionDbService: CourseVersionDbService,
    private readonly lessonMapDbService: LessonMapDbService,
    private readonly quizDbService: QuizDbService,
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
    const totalLessons = await this.lessonMapDbService.count({
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
        totalLessons: totalLessons,
        totalQuizzes: totalQuizzes,
      },
    });
    const enrollmentResponse = plainToInstance(EnrollmentsResponseDto, enrollment);
    return {
      message: 'Enrollment created successfully',
      data: enrollmentResponse,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProgressDbService } from 'src/repository/userProgress.db-service';
import { CreateUserProgressDto } from './dto/create-userProgress.dto';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { ProcessStatus } from 'src/generated/prisma/enums';

@Injectable()
export class UserProgressService {
  constructor(
    private readonly userProgressDbService: UserProgressDbService,
    private readonly enrollmentDbService: EnrollmentsDbService,
  ) {}

  async create(payload: CreateUserProgressDto, user: any) {
    const enrollment = await this.enrollmentDbService.findFirst({
      where: {
        id: payload.enrollmentId,
        userId: user.id,
      },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    const userProgress = await this.userProgressDbService.create({
      data: {
        userId: user.id,
        subTopicId: payload.subTopicId,
        enrollmentId: payload.enrollmentId,
        status: payload.status,
        currentTimeStamp: payload.currentTimeStamp,
        startedAt: payload.startedAt,
        completedAt: payload.status === ProcessStatus.COMPLETED ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });
    await this.enrollmentDbService.update({
      where: {
        id: payload.enrollmentId,
        userId: user.id,
      },
      data: {
        LastAccessedSubTopicId: payload.subTopicId,
      },
    });
    return {
      message: 'User progress created successfully',
      data: userProgress,
    };
  }

  async findAll(enrollmentId: string, user: any) {
    const userProgress = await this.userProgressDbService.findMany({
      where: {
        enrollmentId,
        userId: user.id,
      },
    });
    return {
      message: 'User progress fetched successfully',
      data: userProgress,
    };
  }
}

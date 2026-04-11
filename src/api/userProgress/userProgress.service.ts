import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProgressDbService } from 'src/repository/userProgress.db-service';
import { CreateUserProgressDto } from './dto/create-userProgress.dto';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { ProcessStatus } from 'src/generated/prisma/enums';
import { plainToInstance } from 'class-transformer';
import { UserProgressResponseDto } from './response/userProgress.type';
import { ClassRoomProgressDbService } from 'src/repository/classRoomProgress.db-service';

@Injectable()
export class UserProgressService {
  constructor(
    private readonly userProgressDbService: UserProgressDbService,
    private readonly enrollmentDbService: EnrollmentsDbService,
    private readonly classRoomProgressDbService: ClassRoomProgressDbService,
  ) {}

  async create(payload: CreateUserProgressDto, user: any) {
    const enrollment = await this.enrollmentDbService.findFirst({
      where: {
        id: payload.enrollmentId,
        userId: user.userId,
      },
    });
    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    if (enrollment.classRoomId && payload.status === ProcessStatus.COMPLETED) {
      const classRoomProgress = await this.classRoomProgressDbService.findFirst({
        where: {
          classRoomId: enrollment.classRoomId,
          subTopicId: payload.subTopicId,
        }
      })

      if(!classRoomProgress || classRoomProgress.status !== ProcessStatus.COMPLETED){
        throw new NotFoundException('ClassRoom is not completed')
      }
    }
    const userProgress = await this.userProgressDbService.upsert({
      where: {
        enrollmentId_subTopicId: {
          enrollmentId: payload.enrollmentId,
          subTopicId: payload.subTopicId,
        },
      },
      update: {
        status: payload.status,
        currentTimeStamp: payload.currentTimeStamp,
        completedAt: payload.status === ProcessStatus.COMPLETED ? new Date() : null,
        lastAccessedAt: new Date(),
      },
      create: {
        userId: user.userId,
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
        completedSubTopics:
          payload.status === ProcessStatus.COMPLETED
            ? enrollment.completedSubTopics + 1
            : enrollment.completedSubTopics,
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
    const userProgressResponseDto = plainToInstance(UserProgressResponseDto, userProgress);
    return {
      message: 'User progress fetched successfully',
      data: userProgressResponseDto,
    };
  }

  async getUserProgress(subTopicId: string, enrollmentId: string) {
    const userProgress = await this.userProgressDbService.findFirst({
      where: {
        enrollmentId,
        subTopicId,
      },
    });
    const userProgressResponseDto = userProgress ? plainToInstance(UserProgressResponseDto, userProgress) : null;
    return {
      message: 'User progress fetched successfully',
      data: userProgressResponseDto,
    };
  }
}

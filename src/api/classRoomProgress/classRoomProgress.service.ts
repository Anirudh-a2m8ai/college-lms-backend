import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassRoomProgressDto } from './dto/classRoomProgress.dto';
import { ClassRoomDbService } from 'src/repository/classRoom.db-service';
import { ClassRoomProgressDbService } from 'src/repository/classRoomProgress.db-service';
import { ProcessStatus } from 'src/generated/prisma/enums';
import { plainToInstance } from 'class-transformer';
import { ClassRoomProgressResponseDto } from './response/classRoomProgress.type';

@Injectable()
export class ClassRoomProgressService {
  constructor(
    private readonly classRoomProgressDbService: ClassRoomProgressDbService,
    private readonly classRoomDbService: ClassRoomDbService,
  ) {}

  async create(payload: CreateClassRoomProgressDto) {
    const ClassRoom = await this.classRoomDbService.findFirst({
      where: {
        id: payload.classRoomId,
      },
    });
    if (!ClassRoom) {
      throw new BadRequestException('ClassRoom not found');
    }

    const classRoomProgress = await this.classRoomProgressDbService.upsert({
      where: {
        classRoomId_subTopicId: {
          classRoomId: payload.classRoomId,
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
        classRoomId: payload.classRoomId,
        subTopicId: payload.subTopicId,
        status: payload.status,
        currentTimeStamp: payload.currentTimeStamp,
        startedAt: payload.startedAt,
        completedAt: payload.status === ProcessStatus.COMPLETED ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });

    await this.classRoomDbService.update({
      where: {
        id: payload.classRoomId,
      },
      data: {
        lastAccessedSubTopicId: payload.subTopicId,
      },
    });

    const classRoomProgressResponse = plainToInstance(ClassRoomProgressResponseDto, classRoomProgress);
    return {
      message: 'ClassRoom progress updated successfully',
      data: classRoomProgressResponse,
    };
  }

  async getClassRoomProgress(classRoomId: string) {
    const classRoomProgress = await this.classRoomProgressDbService.findMany({
      where: {
        classRoomId,
      },
    });
    const classRoomProgressResponse = plainToInstance(ClassRoomProgressResponseDto, classRoomProgress);
    return {
      message: 'ClassRoom progress fetched successfully',
      data: classRoomProgressResponse,
    };
  }

  async get(subTopicId: string, classRoomId: string) {
    const classRoomProgress = await this.classRoomProgressDbService.findFirst({
      where: {
        subTopicId,
        classRoomId,
      },
    });
    const classRoomProgressResponse = plainToInstance(ClassRoomProgressResponseDto, classRoomProgress);
    return {
      message: 'ClassRoom progress fetched successfully',
      data: classRoomProgressResponse,
    };
  }
}

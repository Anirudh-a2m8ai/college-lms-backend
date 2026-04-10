import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassRoomDbService } from 'src/repository/classRoom.db-service';
import { CreateClassRoomDto } from './dto/create-classRoom.dto';
import { plainToInstance } from 'class-transformer';
import { ClassRoomResponseDto } from './response/classRoom.type';

@Injectable()
export class ClassRoomService {
  constructor(private readonly classRoomDbService: ClassRoomDbService) {}

  async create(payload: CreateClassRoomDto, user: any) {
    const existingClassRoom = await this.classRoomDbService.findFirst({
      where: {
        name: payload.name,
        courseId: payload.courseId,
        sourceCourseVersionId: payload.sourceCourseVersionId,
      },
    });
    if (existingClassRoom) {
      throw new BadRequestException('Class room already exists');
    }
    const classRoom = await this.classRoomDbService.create({
      data: {
        name: payload.name,
        status: payload.status,
        courseId: payload.courseId,
        sourceCourseVersionId: payload.sourceCourseVersionId,
        tenantId: payload.tenantId,
        userId: user.userId,
      },
    });
    await this.classRoomDbService.createClassRoomMap(classRoom.id, payload.sourceCourseVersionId);
    const classRoomResponse = plainToInstance(ClassRoomResponseDto, classRoom);
    return {
      message: 'Class room created successfully',
      data: classRoomResponse,
    };
  }

  async get(id: string, user: any) {
    const classRoom = await this.classRoomDbService.findUnique({
      where: {
        id,
      },
    });
    if (!classRoom) {
      throw new NotFoundException('Class room not found');
    }
    const classRoomContent = await this.classRoomDbService.getClassRoom(id);
    const classRoomMap = {
      ...classRoom,
      modules: classRoomContent,
    };
    console.log(classRoomContent);

    const classRoomResponse = plainToInstance(ClassRoomResponseDto, classRoomMap);
    return classRoomResponse;
  }
}

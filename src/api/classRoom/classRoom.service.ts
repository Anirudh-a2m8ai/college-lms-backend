import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClassRoomDbService } from 'src/repository/classRoom.db-service';
import { CreateClassRoomDto } from './dto/create-classRoom.dto';
import { plainToInstance } from 'class-transformer';
import { ClassRoomResponseDto } from './response/classRoom.type';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { UserDbService } from 'src/repository/user.db-service';

@Injectable()
export class ClassRoomService {
  constructor(
    private readonly classRoomDbService: ClassRoomDbService,
    private readonly userDbService: UserDbService,
  ) {}

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
        startDate: payload.startDate,
        endDate: payload.endDate,
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

    const classRoomResponse = plainToInstance(ClassRoomResponseDto, classRoomMap);
    return classRoomResponse;
  }

  async list(query: SearchInputDto, body: any, user: any) {
    if (user.role === 'student') {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    if (user.tenantId) {
      filterInput.tenantId = user.tenantId;
    }

    if (user.role === 'instructor') {
      filterInput.userId = user.userId;
    }

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.classRoomDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.classRoomDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(ClassRoomResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async enrolledUsers(query: SearchInputDto, body: any, user: any) {
    if (user.role === 'student') {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};
    filterInput.enrollments.some.classRoomId = body.classRoomId;

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.userDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.userDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(ClassRoomResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }
}

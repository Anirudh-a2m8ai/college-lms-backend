import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LiveClassDbService } from 'src/repository/liveClass.db-service';
import { CreateLiveClassDto, StartLiveClassDto } from './dto/liveClass.dto';
import { plainToInstance } from 'class-transformer';
import { LiveClassResponseDto } from './response/liveClass.type';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';

const now = new Date();
const ONE_HOUR = 60 * 60 * 1000;
@Injectable()
export class LiveClassService {
  constructor(
    private readonly liveClassDbService: LiveClassDbService,
    private readonly enrollmentsDbService: EnrollmentsDbService,
  ) {}

  async createLiveClass(payload: CreateLiveClassDto, user: any) {
    const liveClass = await this.liveClassDbService.create({
      data: {
        startTime: payload.startTime,
        endTime: payload.endTime,
        classRoomId: payload.classRoomId,
        hostId: payload.hostId,
      },
    });

    const liveClassResponse = plainToInstance(LiveClassResponseDto, liveClass);

    return {
      message: 'Live class created successfully',
      data: liveClassResponse,
    };
  }

  async findAllLiveClass(query: SearchInputDto, body: any, user: any) {
    if (user.role === 'student') {
      return this.enrolledLiveClasses(query, body, user);
    }
    if (user.role === 'teacher') {
      return this.hostLiveClassList(query, body, user);
    }
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.liveClassDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { classRoom: true },
      }),
      this.liveClassDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(LiveClassResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async enrolledLiveClasses(query: SearchInputDto, body: any, user: any) {
    const userClassRoom = await this.enrollmentsDbService.findMany({
      where: {
        userId: user.id,
      },
    });
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    filterInput.status = {
      not: 'COMPLETED',
    };

    filterInput.endTime = {
      gte: new Date(now.getTime() - ONE_HOUR),
    };

    filterInput.classRoomId = {
      in: userClassRoom.map((item) => item.classRoomId).filter((id) => id !== null),
    };

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.liveClassDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { classRoom: true },
      }),
      this.liveClassDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(LiveClassResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async hostLiveClassList(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    filterInput.hostId = user.userId;

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.liveClassDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { classRoom: true },
      }),
      this.liveClassDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(LiveClassResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async joinLiveClass(userId: string, liveClassId: string) {
    const liveClass = await this.liveClassDbService.findUnique({
      where: {
        id: liveClassId,
      },
      include: {
        classRoom: true,
      },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    const userClassRoom = await this.enrollmentsDbService.findFirst({
      where: {
        classRoomId: liveClass.classRoomId,
        userId: userId,
      },
    });

    if (!userClassRoom) {
      throw new UnauthorizedException('User not authorized user');
    }

    return true;
  }
}

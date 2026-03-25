import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseDbService } from 'src/repository/course.db-service';
import { CreateCourseDto } from './dto/create-course.dto';
import { plainToInstance } from 'class-transformer';
import { CourseResponseDto } from './response/course.type';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly courseDbService: CourseDbService) {}

  async create(payload: CreateCourseDto, user: any) {
    const existingCourseCode = await this.courseDbService.findFirst({
      where: {
        courseCode: payload.courseCode,
        tenantId: user.tenantId ? user.tenantId : payload.tenantId,
        isDeleted: false,
      },
    });
    if (existingCourseCode) {
      throw new BadRequestException('Course code already exists');
    }
    const course = await this.courseDbService.create({
      data: {
        ...payload,
        tenantId: user.tenantId ? user.tenantId : payload.tenantId,
      },
    });

    const courseResponse = plainToInstance(CourseResponseDto, course);

    return courseResponse;
  }

  async findAll(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    if (user.tenantId) {
      filterInput.tenantId = user.tenantId;
    }

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.courseDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { tenant: true },
      }),
      this.courseDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(CourseResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async findOne(id: string) {
    const course = await this.courseDbService.findUnique({
      where: {
        id,
      },
      include: { tenant: true },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const courseResponse = plainToInstance(CourseResponseDto, course);

    return courseResponse;
  }

  async update(id: string, payload: UpdateCourseDto, user: any) {
    const isExist = await this.courseDbService.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Course not found');
    }
    const course = await this.courseDbService.update({
      where: {
        id,
      },
      data: payload,
    });

    const courseResponse = plainToInstance(CourseResponseDto, course);

    return courseResponse;
  }

  async delete(id: string) {
    const isExist = await this.courseDbService.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Course not found');
    }
    const course = await this.courseDbService.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    const courseResponse = plainToInstance(CourseResponseDto, course);

    return courseResponse;
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseDbService } from 'src/repository/course.db-service';
import { CreateCourseDto } from './dto/create-course.dto';
import { plainToInstance } from 'class-transformer';
import { CourseResponseDto, CourseVersionResponseDto } from './response/course.type';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { CourseStatus } from 'src/generated/prisma/enums';
import { EnableEditDto } from './dto/enable-edit.dto';
import { Course, CourseVersion } from 'src/generated/prisma/client';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseDbService: CourseDbService,
    private readonly courseVersionDbService: CourseVersionDbService,
  ) {}

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
    const { versionName, ...rest } = payload;
    const course = await this.courseDbService.create({
      data: {
        ...rest,
        tenantId: user.tenantId ? user.tenantId : payload.tenantId,
      },
    });
    const courseVersion = await this.courseVersionDbService.create({
      data: {
        courseId: course.id,
        versionName: versionName,
        tenantId: user.tenantId ? user.tenantId : payload.tenantId,
        status: CourseStatus.DRAFT,
      },
    });

    const updatedCourse = await this.courseDbService.update({
      where: {
        id: course.id,
      },
      data: {
        latestCourseVersionId: courseVersion.id,
      },
    });
    const courseResponse = plainToInstance(CourseResponseDto, updatedCourse);
    return {
      message: 'Course created successfully',
      data: courseResponse,
    };
  }

  async findAll(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    const filterInput = body?.filter ? { ...body.filter } : {};

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

    return {
      message: 'Course updated successfully',
      data: courseResponse,
    };
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

    return {
      message: 'Course deleted successfully',
    };
  }

  async createLessonPlan(payload: any, user: any) {
    const courseVersion = await this.courseVersionDbService.findUnique({
      where: {
        id: payload.courseVersionId,
      },
    });
    if (!courseVersion) {
      throw new NotFoundException('Course version not found');
    }
    const courseVersionEntity = await this.courseVersionDbService.createCourseVersion(payload, courseVersion.id);
    return courseVersionEntity;
  }

  async getCourseVersion(courseVersionId: string) {
    const courseVersion = (await this.courseVersionDbService.findUnique({
      where: {
        id: courseVersionId,
      },
      include: { course: true },
    })) as CourseVersion & { course: Course };
    if (!courseVersion) {
      throw new NotFoundException('Course version not found');
    }
    const draftCourseVersion = await this.courseVersionDbService.findFirst({
      where: {
        courseId: courseVersion.courseId,
        status: CourseStatus.DRAFT,
      },
    });
    const courseVersionEntity = await this.courseVersionDbService.getCourseVersion(courseVersionId);
    const courseVersionResponse = {
      ...courseVersion,
      module: courseVersionEntity.module,
    };
    const courseVersionResponseDto = plainToInstance(CourseVersionResponseDto, courseVersionResponse, {
      excludeExtraneousValues: true,
    });
    if (draftCourseVersion) {
      courseVersionResponseDto.draftCourseVersionId = draftCourseVersion.id;
      courseVersionResponseDto.draftCourseVersionName = draftCourseVersion.versionName;
    }
    const course = plainToInstance(CourseResponseDto, courseVersion.course, {
      excludeExtraneousValues: true,
    });
    const courseResponse = {
      course: course,
      courseVersion: courseVersionResponseDto,
    };
    return {
      message: 'Course version fetched successfully',
      data: courseResponse,
    };
  }

  async updateCourseVersionStatus(courseVersionId: string, payload: any, user: any) {
    const courseVersion = await this.courseVersionDbService.findUnique({
      where: {
        id: courseVersionId,
      },
    });
    if (!courseVersion) {
      throw new NotFoundException('Course version not found');
    }
    const courseVersionEntity = await this.courseVersionDbService.update({
      where: {
        id: courseVersionId,
      },
      data: {
        status: payload.status,
      },
    });
    if (payload.status === CourseStatus.PUBLISHED) {
      await this.courseDbService.update({
        where: {
          id: courseVersion.courseId,
        },
        data: {
          latestCourseVersionId: courseVersionId,
        },
      });
    }
    return {
      message: 'Course version status updated successfully',
      data: courseVersionEntity,
    };
  }

  async enableEdit(payload: EnableEditDto, user: any) {
    const course = await this.courseDbService.findUnique({
      where: {
        id: payload.courseId,
      },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (!course.latestCourseVersionId) {
      throw new NotFoundException('Course version not found');
    }

    const courseVersionEntity = await this.courseVersionDbService.createDraftWithClone(
      course.id,
      course.tenantId,
      course.latestCourseVersionId,
      payload.versionName,
    );

    return {
      message: 'Course version enabled successfully',
      data: courseVersionEntity,
    };
  }

  async getCourseVersionList(courseId: string) {
    const courseVersions = await this.courseVersionDbService.findMany({
      where: {
        courseId,
      },
      include: { course: true },
    });
    const courseVersionResponse = plainToInstance(CourseVersionResponseDto, courseVersions, {
      excludeExtraneousValues: true,
    });
    return {
      data: courseVersionResponse,
    };
  }

  async getLatestPublishedCourseVersions(user: any) {
    const courses = (await this.courseDbService.findMany({
      where: {
        tenantId: user.tenantId,
        isDeleted: false,
        courseVersions: {
          some: {
            status: CourseStatus.PUBLISHED,
            isDeleted: false,
          },
        },
      },
      include: {
        courseVersions: {
          where: {
            status: CourseStatus.PUBLISHED,
            isDeleted: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        designation: true,
      },
    })) as any[];

    const result = courses.map((course) => {
      const latestVersion = course.courseVersions[0];
      return {
        ...latestVersion,
        course: course,
      };
    });

    const courseVersionResponse = plainToInstance(CourseVersionResponseDto, result, {
      excludeExtraneousValues: true,
    });

    return {
      message: 'Latest published course versions fetched successfully',
      data: courseVersionResponse,
    };
  }
}

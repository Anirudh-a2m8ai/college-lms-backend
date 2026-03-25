import { Injectable } from '@nestjs/common';
import { Prisma, Course } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.CourseFindUniqueArgs): Promise<Course | null> {
    return await this.prisma.course.findUnique(query);
  }

  async findFirst(query: Prisma.CourseFindFirstArgs): Promise<Course | null> {
    return await this.prisma.course.findFirst(query);
  }

  async findMany(query: Prisma.CourseFindManyArgs): Promise<Course[]> {
    return await this.prisma.course.findMany(query);
  }

  async create(payload: Prisma.CourseCreateArgs): Promise<Course> {
    return await this.prisma.course.create(payload);
  }

  async createMany(payload: Prisma.CourseCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.course.createMany(payload);
  }

  async update(payload: Prisma.CourseUpdateArgs): Promise<Course> {
    return await this.prisma.course.update(payload);
  }

  async delete(payload: Prisma.CourseDeleteArgs): Promise<Course> {
    return await this.prisma.course.delete(payload);
  }

  async count(query: Prisma.CourseCountArgs): Promise<number> {
    return await this.prisma.course.count(query);
  }
}

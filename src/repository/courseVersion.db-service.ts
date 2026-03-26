import { Injectable } from '@nestjs/common';
import { Prisma, CourseVersion } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseVersionDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.CourseVersionFindUniqueArgs): Promise<CourseVersion | null> {
    return await this.prisma.courseVersion.findUnique(query);
  }

  async findFirst(query: Prisma.CourseVersionFindFirstArgs): Promise<CourseVersion | null> {
    return await this.prisma.courseVersion.findFirst(query);
  }

  async findMany(query: Prisma.CourseVersionFindManyArgs): Promise<CourseVersion[]> {
    return await this.prisma.courseVersion.findMany(query);
  }

  async create(payload: Prisma.CourseVersionCreateArgs): Promise<CourseVersion> {
    return await this.prisma.courseVersion.create(payload);
  }

  async createMany(payload: Prisma.CourseVersionCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.courseVersion.createMany(payload);
  }

  async update(payload: Prisma.CourseVersionUpdateArgs): Promise<CourseVersion> {
    return await this.prisma.courseVersion.update(payload);
  }

  async delete(payload: Prisma.CourseVersionDeleteArgs): Promise<CourseVersion> {
    return await this.prisma.courseVersion.delete(payload);
  }

  async count(query: Prisma.CourseVersionCountArgs): Promise<number> {
    return await this.prisma.courseVersion.count(query);
  }
}

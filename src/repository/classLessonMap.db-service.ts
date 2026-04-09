import { Injectable } from '@nestjs/common';
import { Prisma, ClassLessonMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassLessonMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassLessonMapFindUniqueArgs): Promise<ClassLessonMap | null> {
    return await this.prisma.classLessonMap.findUnique(query);
  }

  async findFirst(query: Prisma.ClassLessonMapFindFirstArgs): Promise<ClassLessonMap | null> {
    return await this.prisma.classLessonMap.findFirst(query);
  }

  async findMany(query: Prisma.ClassLessonMapFindManyArgs): Promise<ClassLessonMap[]> {
    return await this.prisma.classLessonMap.findMany(query);
  }

  async create(payload: Prisma.ClassLessonMapCreateArgs): Promise<ClassLessonMap> {
    return await this.prisma.classLessonMap.create(payload);
  }

  async createMany(payload: Prisma.ClassLessonMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classLessonMap.createMany(payload);
  }

  async update(payload: Prisma.ClassLessonMapUpdateArgs): Promise<ClassLessonMap> {
    return await this.prisma.classLessonMap.update(payload);
  }

  async delete(payload: Prisma.ClassLessonMapDeleteArgs): Promise<ClassLessonMap> {
    return await this.prisma.classLessonMap.delete(payload);
  }

  async count(query: Prisma.ClassLessonMapCountArgs): Promise<number> {
    return await this.prisma.classLessonMap.count(query);
  }
}
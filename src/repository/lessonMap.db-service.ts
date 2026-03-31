import { Injectable } from '@nestjs/common';
import { Prisma, lessonMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.lessonMapFindUniqueArgs): Promise<lessonMap | null> {
    return await this.prisma.lessonMap.findUnique(query);
  }

  async findFirst(query: Prisma.lessonMapFindFirstArgs): Promise<lessonMap | null> {
    return await this.prisma.lessonMap.findFirst(query);
  }

  async findMany(query: Prisma.lessonMapFindManyArgs): Promise<lessonMap[]> {
    return await this.prisma.lessonMap.findMany(query);
  }

  async create(payload: Prisma.lessonMapCreateArgs): Promise<lessonMap> {
    return await this.prisma.lessonMap.create(payload);
  }

  async createMany(payload: Prisma.lessonMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.lessonMap.createMany(payload);
  }

  async update(payload: Prisma.lessonMapUpdateArgs): Promise<lessonMap> {
    return await this.prisma.lessonMap.update(payload);
  }

  async updateMany(payload: Prisma.lessonMapUpdateManyArgs): Promise<BatchPayload> {
    return await this.prisma.lessonMap.updateMany(payload);
  }

  async delete(payload: Prisma.lessonMapDeleteArgs): Promise<lessonMap> {
    return await this.prisma.lessonMap.delete(payload);
  }

  async count(query: Prisma.lessonMapCountArgs): Promise<number> {
    return await this.prisma.lessonMap.count(query);
  }
}

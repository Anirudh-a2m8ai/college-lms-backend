import { Injectable } from '@nestjs/common';
import { Prisma, Lesson } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LessonDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.LessonFindUniqueArgs): Promise<Lesson | null> {
    return await this.prisma.lesson.findUnique(query);
  }

  async findFirst(query: Prisma.LessonFindFirstArgs): Promise<Lesson | null> {
    return await this.prisma.lesson.findFirst(query);
  }

  async findMany(query: Prisma.LessonFindManyArgs): Promise<Lesson[]> {
    return await this.prisma.lesson.findMany(query);
  }

  async create(payload: Prisma.LessonCreateArgs): Promise<Lesson> {
    return await this.prisma.lesson.create(payload);
  }

  async createMany(payload: Prisma.LessonCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.lesson.createMany(payload);
  }

  async update(payload: Prisma.LessonUpdateArgs): Promise<Lesson> {
    return await this.prisma.lesson.update(payload);
  }

  async delete(payload: Prisma.LessonDeleteArgs): Promise<Lesson> {
    return await this.prisma.lesson.delete(payload);
  }

  async count(query: Prisma.LessonCountArgs): Promise<number> {
    return await this.prisma.lesson.count(query);
  }
}

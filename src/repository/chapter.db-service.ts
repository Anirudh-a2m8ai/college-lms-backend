import { Injectable } from '@nestjs/common';
import { Prisma, Chapter } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChapterDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ChapterFindUniqueArgs): Promise<Chapter | null> {
    return await this.prisma.chapter.findUnique(query);
  }

  async findFirst(query: Prisma.ChapterFindFirstArgs): Promise<Chapter | null> {
    return await this.prisma.chapter.findFirst(query);
  }

  async findMany(query: Prisma.ChapterFindManyArgs): Promise<Chapter[]> {
    return await this.prisma.chapter.findMany(query);
  }

  async create(payload: Prisma.ChapterCreateArgs): Promise<Chapter> {
    return await this.prisma.chapter.create(payload);
  }

  async createMany(payload: Prisma.ChapterCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.chapter.createMany(payload);
  }

  async update(payload: Prisma.ChapterUpdateArgs): Promise<Chapter> {
    return await this.prisma.chapter.update(payload);
  }

  async delete(payload: Prisma.ChapterDeleteArgs): Promise<Chapter> {
    return await this.prisma.chapter.delete(payload);
  }

  async count(query: Prisma.ChapterCountArgs): Promise<number> {
    return await this.prisma.chapter.count(query);
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma, ChapterMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChapterMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ChapterMapFindUniqueArgs): Promise<ChapterMap | null> {
    return await this.prisma.chapterMap.findUnique(query);
  }

  async findFirst(query: Prisma.ChapterMapFindFirstArgs): Promise<ChapterMap | null> {
    return await this.prisma.chapterMap.findFirst(query);
  }

  async findMany(query: Prisma.ChapterMapFindManyArgs): Promise<ChapterMap[]> {
    return await this.prisma.chapterMap.findMany(query);
  }

  async create(payload: Prisma.ChapterMapCreateArgs): Promise<ChapterMap> {
    return await this.prisma.chapterMap.create(payload);
  }

  async createMany(payload: Prisma.ChapterMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.chapterMap.createMany(payload);
  }

  async update(payload: Prisma.ChapterMapUpdateArgs): Promise<ChapterMap> {
    return await this.prisma.chapterMap.update(payload);
  }

  async delete(payload: Prisma.ChapterMapDeleteArgs): Promise<ChapterMap> {
    return await this.prisma.chapterMap.delete(payload);
  }

  async count(query: Prisma.ChapterMapCountArgs): Promise<number> {
    return await this.prisma.chapterMap.count(query);
  }
}

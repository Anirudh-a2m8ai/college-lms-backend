import { Injectable } from '@nestjs/common';
import { Prisma, ClassChapterMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassChapterMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassChapterMapFindUniqueArgs): Promise<ClassChapterMap | null> {
    return await this.prisma.classChapterMap.findUnique(query);
  }

  async findFirst(query: Prisma.ClassChapterMapFindFirstArgs): Promise<ClassChapterMap | null> {
    return await this.prisma.classChapterMap.findFirst(query);
  }

  async findMany(query: Prisma.ClassChapterMapFindManyArgs): Promise<ClassChapterMap[]> {
    return await this.prisma.classChapterMap.findMany(query);
  }

  async create(payload: Prisma.ClassChapterMapCreateArgs): Promise<ClassChapterMap> {
    return await this.prisma.classChapterMap.create(payload);
  }

  async createMany(payload: Prisma.ClassChapterMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classChapterMap.createMany(payload);
  }

  async update(payload: Prisma.ClassChapterMapUpdateArgs): Promise<ClassChapterMap> {
    return await this.prisma.classChapterMap.update(payload);
  }

  async delete(payload: Prisma.ClassChapterMapDeleteArgs): Promise<ClassChapterMap> {
    return await this.prisma.classChapterMap.delete(payload);
  }

  async count(query: Prisma.ClassChapterMapCountArgs): Promise<number> {
    return await this.prisma.classChapterMap.count(query);
  }
}

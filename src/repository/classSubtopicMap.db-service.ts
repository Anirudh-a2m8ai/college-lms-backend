import { Injectable } from '@nestjs/common';
import { Prisma, ClassSubTopicMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassSubTopicMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassSubTopicMapFindUniqueArgs): Promise<ClassSubTopicMap | null> {
    return await this.prisma.classSubTopicMap.findUnique(query);
  }

  async findFirst(query: Prisma.ClassSubTopicMapFindFirstArgs): Promise<ClassSubTopicMap | null> {
    return await this.prisma.classSubTopicMap.findFirst(query);
  }

  async findMany(query: Prisma.ClassSubTopicMapFindManyArgs): Promise<ClassSubTopicMap[]> {
    return await this.prisma.classSubTopicMap.findMany(query);
  }

  async create(payload: Prisma.ClassSubTopicMapCreateArgs): Promise<ClassSubTopicMap> {
    return await this.prisma.classSubTopicMap.create(payload);
  }

  async createMany(payload: Prisma.ClassSubTopicMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classSubTopicMap.createMany(payload);
  }

  async update(payload: Prisma.ClassSubTopicMapUpdateArgs): Promise<ClassSubTopicMap> {
    return await this.prisma.classSubTopicMap.update(payload);
  }

  async delete(payload: Prisma.ClassSubTopicMapDeleteArgs): Promise<ClassSubTopicMap> {
    return await this.prisma.classSubTopicMap.delete(payload);
  }

  async count(query: Prisma.ClassSubTopicMapCountArgs): Promise<number> {
    return await this.prisma.classSubTopicMap.count(query);
  }
}
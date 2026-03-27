import { Injectable } from '@nestjs/common';
import { Prisma, subTopicMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubTopicMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.subTopicMapFindUniqueArgs): Promise<subTopicMap | null> {
    return await this.prisma.subTopicMap.findUnique(query);
  }

  async findFirst(query: Prisma.subTopicMapFindFirstArgs): Promise<subTopicMap | null> {
    return await this.prisma.subTopicMap.findFirst(query);
  }

  async findMany(query: Prisma.subTopicMapFindManyArgs): Promise<subTopicMap[]> {
    return await this.prisma.subTopicMap.findMany(query);
  }

  async create(payload: Prisma.subTopicMapCreateArgs): Promise<subTopicMap> {
    return await this.prisma.subTopicMap.create(payload);
  }

  async createMany(payload: Prisma.subTopicMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.subTopicMap.createMany(payload);
  }

  async update(payload: Prisma.subTopicMapUpdateArgs): Promise<subTopicMap> {
    return await this.prisma.subTopicMap.update(payload);
  }

  async delete(payload: Prisma.subTopicMapDeleteArgs): Promise<subTopicMap> {
    return await this.prisma.subTopicMap.delete(payload);
  }

  async count(query: Prisma.subTopicMapCountArgs): Promise<number> {
    return await this.prisma.subTopicMap.count(query);
  }
}

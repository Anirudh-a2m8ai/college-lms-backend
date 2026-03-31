import { Injectable } from '@nestjs/common';
import { Prisma, TopicMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.TopicMapFindUniqueArgs): Promise<TopicMap | null> {
    return await this.prisma.topicMap.findUnique(query);
  }

  async findFirst(query: Prisma.TopicMapFindFirstArgs): Promise<TopicMap | null> {
    return await this.prisma.topicMap.findFirst(query);
  }

  async findMany(query: Prisma.TopicMapFindManyArgs): Promise<TopicMap[]> {
    return await this.prisma.topicMap.findMany(query);
  }

  async create(payload: Prisma.TopicMapCreateArgs): Promise<TopicMap> {
    return await this.prisma.topicMap.create(payload);
  }

  async createMany(payload: Prisma.TopicMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.topicMap.createMany(payload);
  }

  async update(payload: Prisma.TopicMapUpdateArgs): Promise<TopicMap> {
    return await this.prisma.topicMap.update(payload);
  }

  async updateMany(payload: Prisma.TopicMapUpdateManyArgs): Promise<BatchPayload> {
    return await this.prisma.topicMap.updateMany(payload);
  }

  async delete(payload: Prisma.TopicMapDeleteArgs): Promise<TopicMap> {
    return await this.prisma.topicMap.delete(payload);
  }

  async count(query: Prisma.TopicMapCountArgs): Promise<number> {
    return await this.prisma.topicMap.count(query);
  }
}

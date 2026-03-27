import { Injectable } from '@nestjs/common';
import { Prisma, Topics } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.TopicsFindUniqueArgs): Promise<Topics | null> {
    return await this.prisma.topics.findUnique(query);
  }

  async findFirst(query: Prisma.TopicsFindFirstArgs): Promise<Topics | null> {
    return await this.prisma.topics.findFirst(query);
  }

  async findMany(query: Prisma.TopicsFindManyArgs): Promise<Topics[]> {
    return await this.prisma.topics.findMany(query);
  }

  async create(payload: Prisma.TopicsCreateArgs): Promise<Topics> {
    return await this.prisma.topics.create(payload);
  }

  async createMany(payload: Prisma.TopicsCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.topics.createMany(payload);
  }

  async update(payload: Prisma.TopicsUpdateArgs): Promise<Topics> {
    return await this.prisma.topics.update(payload);
  }

  async delete(payload: Prisma.TopicsDeleteArgs): Promise<Topics> {
    return await this.prisma.topics.delete(payload);
  }

  async count(query: Prisma.TopicsCountArgs): Promise<number> {
    return await this.prisma.topics.count(query);
  }
}

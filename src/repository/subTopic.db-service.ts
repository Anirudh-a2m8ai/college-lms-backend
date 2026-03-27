import { Injectable } from '@nestjs/common';
import { Prisma, SubTopics } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubTopicDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.SubTopicsFindUniqueArgs): Promise<SubTopics | null> {
    return await this.prisma.subTopics.findUnique(query);
  }

  async findFirst(query: Prisma.SubTopicsFindFirstArgs): Promise<SubTopics | null> {
    return await this.prisma.subTopics.findFirst(query);
  }

  async findMany(query: Prisma.SubTopicsFindManyArgs): Promise<SubTopics[]> {
    return await this.prisma.subTopics.findMany(query);
  }

  async create(payload: Prisma.SubTopicsCreateArgs): Promise<SubTopics> {
    return await this.prisma.subTopics.create(payload);
  }

  async createMany(payload: Prisma.SubTopicsCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.subTopics.createMany(payload);
  }

  async update(payload: Prisma.SubTopicsUpdateArgs): Promise<SubTopics> {
    return await this.prisma.subTopics.update(payload);
  }

  async delete(payload: Prisma.SubTopicsDeleteArgs): Promise<SubTopics> {
    return await this.prisma.subTopics.delete(payload);
  }

  async count(query: Prisma.SubTopicsCountArgs): Promise<number> {
    return await this.prisma.subTopics.count(query);
  }
}

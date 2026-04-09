import { Injectable } from '@nestjs/common';
import { Prisma, ClassTopicMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassTopicMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassTopicMapFindUniqueArgs): Promise<ClassTopicMap | null> {
    return await this.prisma.classTopicMap.findUnique(query);
  }

  async findFirst(query: Prisma.ClassTopicMapFindFirstArgs): Promise<ClassTopicMap | null> {
    return await this.prisma.classTopicMap.findFirst(query);
  }

  async findMany(query: Prisma.ClassTopicMapFindManyArgs): Promise<ClassTopicMap[]> {
    return await this.prisma.classTopicMap.findMany(query);
  }

  async create(payload: Prisma.ClassTopicMapCreateArgs): Promise<ClassTopicMap> {
    return await this.prisma.classTopicMap.create(payload);
  }

  async createMany(payload: Prisma.ClassTopicMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classTopicMap.createMany(payload);
  }

  async update(payload: Prisma.ClassTopicMapUpdateArgs): Promise<ClassTopicMap> {
    return await this.prisma.classTopicMap.update(payload);
  }

  async delete(payload: Prisma.ClassTopicMapDeleteArgs): Promise<ClassTopicMap> {
    return await this.prisma.classTopicMap.delete(payload);
  }

  async count(query: Prisma.ClassTopicMapCountArgs): Promise<number> {
    return await this.prisma.classTopicMap.count(query);
  }
}

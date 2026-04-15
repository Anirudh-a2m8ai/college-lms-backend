import { Injectable } from '@nestjs/common';
import { Prisma, LiveClass } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiveClassDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.LiveClassFindUniqueArgs): Promise<LiveClass | null> {
    return await this.prisma.liveClass.findUnique(query);
  }

  async findFirst(query: Prisma.LiveClassFindFirstArgs): Promise<LiveClass | null> {
    return await this.prisma.liveClass.findFirst(query);
  }

  async findMany(query: Prisma.LiveClassFindManyArgs): Promise<LiveClass[]> {
    return await this.prisma.liveClass.findMany(query);
  }

  async create(payload: Prisma.LiveClassCreateArgs): Promise<LiveClass> {
    return await this.prisma.liveClass.create(payload);
  }

  async createMany(payload: Prisma.LiveClassCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.liveClass.createMany(payload);
  }

  async update(payload: Prisma.LiveClassUpdateArgs): Promise<LiveClass> {
    return await this.prisma.liveClass.update(payload);
  }

  async delete(payload: Prisma.LiveClassDeleteArgs): Promise<LiveClass> {
    return await this.prisma.liveClass.delete(payload);
  }

  async count(query: Prisma.LiveClassCountArgs): Promise<number> {
    return await this.prisma.liveClass.count(query);
  }
}

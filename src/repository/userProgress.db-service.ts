import { Injectable } from '@nestjs/common';
import { Prisma, UserProgress } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserProgressDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.UserProgressFindUniqueArgs): Promise<UserProgress | null> {
    return await this.prisma.userProgress.findUnique(query);
  }

  async findFirst(query: Prisma.UserProgressFindFirstArgs): Promise<UserProgress | null> {
    return await this.prisma.userProgress.findFirst(query);
  }

  async findMany(query: Prisma.UserProgressFindManyArgs): Promise<UserProgress[]> {
    return await this.prisma.userProgress.findMany(query);
  }
  async create(payload: Prisma.UserProgressCreateArgs): Promise<UserProgress> {
    return await this.prisma.userProgress.create(payload);
  }

  async createMany(payload: Prisma.UserProgressCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.userProgress.createMany(payload);
  }

  async update(payload: Prisma.UserProgressUpdateArgs): Promise<UserProgress> {
    return await this.prisma.userProgress.update(payload);
  }

  async count(query: Prisma.UserProgressCountArgs): Promise<number> {
    return await this.prisma.userProgress.count(query);
  }
}

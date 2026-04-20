import { Injectable } from '@nestjs/common';
import { Prisma, ExamAttempt } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamAttemptDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ExamAttemptFindUniqueArgs): Promise<ExamAttempt | null> {
    return await this.prisma.examAttempt.findUnique(query);
  }

  async findFirst(query: Prisma.ExamAttemptFindFirstArgs): Promise<ExamAttempt | null> {
    return await this.prisma.examAttempt.findFirst(query);
  }

  async findMany(query: Prisma.ExamAttemptFindManyArgs): Promise<ExamAttempt[]> {
    return await this.prisma.examAttempt.findMany(query);
  }

  async create(payload: Prisma.ExamAttemptCreateArgs): Promise<ExamAttempt> {
    return await this.prisma.examAttempt.create(payload);
  }

  async createMany(payload: Prisma.ExamAttemptCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.examAttempt.createMany(payload);
  }

  async update(payload: Prisma.ExamAttemptUpdateArgs): Promise<ExamAttempt> {
    return await this.prisma.examAttempt.update(payload);
  }

  async delete(payload: Prisma.ExamAttemptDeleteArgs): Promise<ExamAttempt> {
    return await this.prisma.examAttempt.delete(payload);
  }

  async count(query: Prisma.ExamAttemptCountArgs): Promise<number> {
    return await this.prisma.examAttempt.count(query);
  }

  async createManyAndReturn(payload: Prisma.ExamAttemptCreateManyArgs): Promise<ExamAttempt[]> {
    return await this.prisma.examAttempt.createManyAndReturn(payload);
  }
}

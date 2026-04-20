import { Injectable } from '@nestjs/common';
import { Prisma, ExamResult } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamResultDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ExamResultFindUniqueArgs): Promise<ExamResult | null> {
    return await this.prisma.examResult.findUnique(query);
  }

  async findFirst(query: Prisma.ExamResultFindFirstArgs): Promise<ExamResult | null> {
    return await this.prisma.examResult.findFirst(query);
  }

  async findMany(query: Prisma.ExamResultFindManyArgs): Promise<ExamResult[]> {
    return await this.prisma.examResult.findMany(query);
  }

  async create(payload: Prisma.ExamResultCreateArgs): Promise<ExamResult> {
    return await this.prisma.examResult.create(payload);
  }

  async createMany(payload: Prisma.ExamResultCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.examResult.createMany(payload);
  }

  async update(payload: Prisma.ExamResultUpdateArgs): Promise<ExamResult> {
    return await this.prisma.examResult.update(payload);
  }

  async delete(payload: Prisma.ExamResultDeleteArgs): Promise<ExamResult> {
    return await this.prisma.examResult.delete(payload);
  }

  async count(query: Prisma.ExamResultCountArgs): Promise<number> {
    return await this.prisma.examResult.count(query);
  }

  async createManyAndReturn(payload: Prisma.ExamResultCreateManyArgs): Promise<ExamResult[]> {
    return await this.prisma.examResult.createManyAndReturn(payload);
  }
}

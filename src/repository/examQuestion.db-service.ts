import { Injectable } from '@nestjs/common';
import { Prisma, ExamQuestion } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamQuestionDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ExamQuestionFindUniqueArgs): Promise<ExamQuestion | null> {
    return await this.prisma.examQuestion.findUnique(query);
  }

  async findFirst(query: Prisma.ExamQuestionFindFirstArgs): Promise<ExamQuestion | null> {
    return await this.prisma.examQuestion.findFirst(query);
  }

  async findMany(query: Prisma.ExamQuestionFindManyArgs): Promise<ExamQuestion[]> {
    return await this.prisma.examQuestion.findMany(query);
  }

  async create(payload: Prisma.ExamQuestionCreateArgs): Promise<ExamQuestion> {
    return await this.prisma.examQuestion.create(payload);
  }

  async createMany(payload: Prisma.ExamQuestionCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.examQuestion.createMany(payload);
  }

  async update(payload: Prisma.ExamQuestionUpdateArgs): Promise<ExamQuestion> {
    return await this.prisma.examQuestion.update(payload);
  }

  async delete(payload: Prisma.ExamQuestionDeleteArgs): Promise<ExamQuestion> {
    return await this.prisma.examQuestion.delete(payload);
  }

  async count(query: Prisma.ExamQuestionCountArgs): Promise<number> {
    return await this.prisma.examQuestion.count(query);
  }

  async createManyAndReturn(payload: Prisma.ExamQuestionCreateManyArgs): Promise<ExamQuestion[]> {
    return await this.prisma.examQuestion.createManyAndReturn(payload);
  }
}

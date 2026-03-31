import { Injectable } from '@nestjs/common';
import { Prisma, QuizQuestion } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizQuestionDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.QuizQuestionFindUniqueArgs): Promise<QuizQuestion | null> {
    return await this.prisma.quizQuestion.findUnique(query);
  }

  async findFirst(query: Prisma.QuizQuestionFindFirstArgs): Promise<QuizQuestion | null> {
    return await this.prisma.quizQuestion.findFirst(query);
  }

  async findMany(query: Prisma.QuizQuestionFindManyArgs): Promise<QuizQuestion[]> {
    return await this.prisma.quizQuestion.findMany(query);
  }

  async create(payload: Prisma.QuizQuestionCreateArgs): Promise<QuizQuestion> {
    return await this.prisma.quizQuestion.create(payload);
  }

  async createMany(payload: Prisma.QuizQuestionCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.quizQuestion.createMany(payload);
  }

  async createManyAndReturn(payload: Prisma.QuizQuestionCreateManyArgs): Promise<QuizQuestion[]> {
    return await this.prisma.quizQuestion.createManyAndReturn(payload);
  }

  async update(payload: Prisma.QuizQuestionUpdateArgs): Promise<QuizQuestion> {
    return await this.prisma.quizQuestion.update(payload);
  }

  async delete(payload: Prisma.QuizQuestionDeleteArgs): Promise<QuizQuestion> {
    return await this.prisma.quizQuestion.delete(payload);
  }

  async count(query: Prisma.QuizQuestionCountArgs): Promise<number> {
    return await this.prisma.quizQuestion.count(query);
  }
}

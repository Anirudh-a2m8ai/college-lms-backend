import { Injectable } from '@nestjs/common';
import { Prisma, Quiz } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.QuizFindUniqueArgs): Promise<Quiz | null> {
    return await this.prisma.quiz.findUnique(query);
  }

  async findFirst(query: Prisma.QuizFindFirstArgs): Promise<Quiz | null> {
    return await this.prisma.quiz.findFirst(query);
  }

  async findMany(query: Prisma.QuizFindManyArgs): Promise<Quiz[]> {
    return await this.prisma.quiz.findMany(query);
  }

  async create(payload: Prisma.QuizCreateArgs): Promise<Quiz> {
    return await this.prisma.quiz.create(payload);
  }

  async createMany(payload: Prisma.QuizCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.quiz.createMany(payload);
  }

  async update(payload: Prisma.QuizUpdateArgs): Promise<Quiz> {
    return await this.prisma.quiz.update(payload);
  }

  async delete(payload: Prisma.QuizDeleteArgs): Promise<Quiz> {
    return await this.prisma.quiz.delete(payload);
  }

  async count(query: Prisma.QuizCountArgs): Promise<number> {
    return await this.prisma.quiz.count(query);
  }
}

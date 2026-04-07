import { Injectable } from '@nestjs/common';
import { Prisma, quizProgress } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizProgressDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.quizProgressFindUniqueArgs): Promise<quizProgress | null> {
    return await this.prisma.quizProgress.findUnique(query);
  }

  async findFirst(query: Prisma.quizProgressFindFirstArgs): Promise<quizProgress | null> {
    return await this.prisma.quizProgress.findFirst(query);
  }

  async findMany(query: Prisma.quizProgressFindManyArgs): Promise<quizProgress[]> {
    return await this.prisma.quizProgress.findMany(query);
  }

  async create(payload: Prisma.quizProgressCreateArgs): Promise<quizProgress> {
    return await this.prisma.quizProgress.create(payload);
  }

  async createMany(payload: Prisma.quizProgressCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.quizProgress.createMany(payload);
  }

  async update(payload: Prisma.quizProgressUpdateArgs): Promise<quizProgress> {
    return await this.prisma.quizProgress.update(payload);
  }

  async delete(payload: Prisma.quizProgressDeleteArgs): Promise<quizProgress> {
    return await this.prisma.quizProgress.delete(payload);
  }

  async count(query: Prisma.quizProgressCountArgs): Promise<number> {
    return await this.prisma.quizProgress.count(query);
  }
}

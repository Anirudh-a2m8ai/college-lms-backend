import { Injectable } from '@nestjs/common';
import { Prisma, Exam } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ExamFindUniqueArgs): Promise<Exam | null> {
    return await this.prisma.exam.findUnique(query);
  }

  async findFirst(query: Prisma.ExamFindFirstArgs): Promise<Exam | null> {
    return await this.prisma.exam.findFirst(query);
  }

  async findMany(query: Prisma.ExamFindManyArgs): Promise<Exam[]> {
    return await this.prisma.exam.findMany(query);
  }

  async create(payload: Prisma.ExamCreateArgs): Promise<Exam> {
    return await this.prisma.exam.create(payload);
  }

  async createMany(payload: Prisma.ExamCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.exam.createMany(payload);
  }

  async update(payload: Prisma.ExamUpdateArgs): Promise<Exam> {
    return await this.prisma.exam.update(payload);
  }

  async delete(payload: Prisma.ExamDeleteArgs): Promise<Exam> {
    return await this.prisma.exam.delete(payload);
  }

  async count(query: Prisma.ExamCountArgs): Promise<number> {
    return await this.prisma.exam.count(query);
  }
}

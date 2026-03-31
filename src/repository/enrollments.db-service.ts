import { Injectable } from '@nestjs/common';
import { Prisma, Enrollments } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentsDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.EnrollmentsFindUniqueArgs): Promise<Enrollments | null> {
    return await this.prisma.enrollments.findUnique(query);
  }

  async findFirst(query: Prisma.EnrollmentsFindFirstArgs): Promise<Enrollments | null> {
    return await this.prisma.enrollments.findFirst(query);
  }

  async findMany(query: Prisma.EnrollmentsFindManyArgs): Promise<Enrollments[]> {
    return await this.prisma.enrollments.findMany(query);
  }

  async create(payload: Prisma.EnrollmentsCreateArgs): Promise<Enrollments> {
    return await this.prisma.enrollments.create(payload);
  }

  async createMany(payload: Prisma.EnrollmentsCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.enrollments.createMany(payload);
  }

  async update(payload: Prisma.EnrollmentsUpdateArgs): Promise<Enrollments> {
    return await this.prisma.enrollments.update(payload);
  }

  async delete(payload: Prisma.EnrollmentsDeleteArgs): Promise<Enrollments> {
    return await this.prisma.enrollments.delete(payload);
  }

  async count(query: Prisma.EnrollmentsCountArgs): Promise<number> {
    return await this.prisma.enrollments.count(query);
  }
}

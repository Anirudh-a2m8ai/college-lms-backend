import { Injectable } from '@nestjs/common';
import { Prisma, Designation } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DesignationDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.DesignationFindUniqueArgs): Promise<Designation | null> {
    return await this.prisma.designation.findUnique(query);
  }

  async findFirst(query: Prisma.DesignationFindFirstArgs): Promise<Designation | null> {
    return await this.prisma.designation.findFirst(query);
  }

  async findMany(query: Prisma.DesignationFindManyArgs): Promise<Designation[]> {
    return await this.prisma.designation.findMany(query);
  }

  async create(payload: Prisma.DesignationCreateArgs): Promise<Designation> {
    return await this.prisma.designation.create(payload);
  }

  async createMany(payload: Prisma.DesignationCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.designation.createMany(payload);
  }

  async update(payload: Prisma.DesignationUpdateArgs): Promise<Designation> {
    return await this.prisma.designation.update(payload);
  }

  async delete(payload: Prisma.DesignationDeleteArgs): Promise<Designation> {
    return await this.prisma.designation.delete(payload);
  }

  async count(query: Prisma.DesignationCountArgs): Promise<number> {
    return await this.prisma.designation.count(query);
  }
}

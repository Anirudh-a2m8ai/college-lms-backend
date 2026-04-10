import { Injectable } from '@nestjs/common';
import { Prisma, ClassRoomProgress } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassRoomProgressDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassRoomProgressFindUniqueArgs): Promise<ClassRoomProgress | null> {
    return await this.prisma.classRoomProgress.findUnique(query);
  }

  async findFirst(query: Prisma.ClassRoomProgressFindFirstArgs): Promise<ClassRoomProgress | null> {
    return await this.prisma.classRoomProgress.findFirst(query);
  }

  async findMany(query: Prisma.ClassRoomProgressFindManyArgs): Promise<ClassRoomProgress[]> {
    return await this.prisma.classRoomProgress.findMany(query);
  }

  async create(payload: Prisma.ClassRoomProgressCreateArgs): Promise<ClassRoomProgress> {
    return await this.prisma.classRoomProgress.create(payload);
  }

  async createMany(payload: Prisma.ClassRoomProgressCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classRoomProgress.createMany(payload);
  }

  async update(payload: Prisma.ClassRoomProgressUpdateArgs): Promise<ClassRoomProgress> {
    return await this.prisma.classRoomProgress.update(payload);
  }

  async upsert(payload: Prisma.ClassRoomProgressUpsertArgs): Promise<ClassRoomProgress> {
    return await this.prisma.classRoomProgress.upsert(payload);
  }

  async delete(payload: Prisma.ClassRoomProgressDeleteArgs): Promise<ClassRoomProgress> {
    return await this.prisma.classRoomProgress.delete(payload);
  }

  async count(query: Prisma.ClassRoomProgressCountArgs): Promise<number> {
    return await this.prisma.classRoomProgress.count(query);
  }
}

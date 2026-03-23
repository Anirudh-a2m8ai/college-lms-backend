import { Injectable } from '@nestjs/common';
import { Prisma, Permission } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.PermissionFindUniqueArgs): Promise<Permission | null> {
    return await this.prisma.permission.findUnique(query);
  }

  async findFirst(query: Prisma.PermissionFindFirstArgs): Promise<Permission | null> {
    return await this.prisma.permission.findFirst(query);
  }

  async findMany(query: Prisma.PermissionFindManyArgs): Promise<Permission[]> {
    return await this.prisma.permission.findMany(query);
  }
  async create(payload: Prisma.PermissionCreateArgs): Promise<Permission> {
    return await this.prisma.permission.create(payload);
  }

  async createMany(payload: Prisma.PermissionCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.permission.createMany(payload);
  }

  async update(payload: Prisma.PermissionUpdateArgs): Promise<Permission> {
    return await this.prisma.permission.update(payload);
  }

  async delete(payload: Prisma.PermissionDeleteArgs): Promise<Permission> {
    return await this.prisma.permission.delete(payload);
  }
}

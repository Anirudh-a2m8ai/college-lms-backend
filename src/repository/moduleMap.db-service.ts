import { Injectable } from '@nestjs/common';
import { Prisma, ModuleMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModuleMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ModuleMapFindUniqueArgs): Promise<ModuleMap | null> {
    return await this.prisma.moduleMap.findUnique(query);
  }

  async findFirst(query: Prisma.ModuleMapFindFirstArgs): Promise<ModuleMap | null> {
    return await this.prisma.moduleMap.findFirst(query);
  }

  async findMany(query: Prisma.ModuleMapFindManyArgs): Promise<ModuleMap[]> {
    return await this.prisma.moduleMap.findMany(query);
  }

  async create(payload: Prisma.ModuleMapCreateArgs): Promise<ModuleMap> {
    return await this.prisma.moduleMap.create(payload);
  }

  async createMany(payload: Prisma.ModuleMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.moduleMap.createMany(payload);
  }

  async update(payload: Prisma.ModuleMapUpdateArgs): Promise<ModuleMap> {
    return await this.prisma.moduleMap.update(payload);
  }

  async delete(payload: Prisma.ModuleMapDeleteArgs): Promise<ModuleMap> {
    return await this.prisma.moduleMap.delete(payload);
  }

  async count(query: Prisma.ModuleMapCountArgs): Promise<number> {
    return await this.prisma.moduleMap.count(query);
  }
}

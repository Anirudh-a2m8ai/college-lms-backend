import { Injectable } from '@nestjs/common';
import { Prisma, Module } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ModuleDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ModuleFindUniqueArgs): Promise<Module | null> {
    return await this.prisma.module.findUnique(query);
  }

  async findFirst(query: Prisma.ModuleFindFirstArgs): Promise<Module | null> {
    return await this.prisma.module.findFirst(query);
  }

  async findMany(query: Prisma.ModuleFindManyArgs): Promise<Module[]> {
    return await this.prisma.module.findMany(query);
  }

  async create(payload: Prisma.ModuleCreateArgs): Promise<Module> {
    return await this.prisma.module.create(payload);
  }

  async createMany(payload: Prisma.ModuleCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.module.createMany(payload);
  }

  async update(payload: Prisma.ModuleUpdateArgs): Promise<Module> {
    return await this.prisma.module.update(payload);
  }

  async delete(payload: Prisma.ModuleDeleteArgs): Promise<Module> {
    return await this.prisma.module.delete(payload);
  }

  async count(query: Prisma.ModuleCountArgs): Promise<number> {
    return await this.prisma.module.count(query);
  }
}

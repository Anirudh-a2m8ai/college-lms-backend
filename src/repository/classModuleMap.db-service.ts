import { Injectable } from '@nestjs/common';
import { Prisma, ClassModuleMap } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassModuleMapDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.ClassModuleMapFindUniqueArgs): Promise<ClassModuleMap | null> {
    return await this.prisma.classModuleMap.findUnique(query);
  }

  async findFirst(query: Prisma.ClassModuleMapFindFirstArgs): Promise<ClassModuleMap | null> {
    return await this.prisma.classModuleMap.findFirst(query);
  }

  async findMany(query: Prisma.ClassModuleMapFindManyArgs): Promise<ClassModuleMap[]> {
    return await this.prisma.classModuleMap.findMany(query);
  }

  async create(payload: Prisma.ClassModuleMapCreateArgs): Promise<ClassModuleMap> {
    return await this.prisma.classModuleMap.create(payload);
  }

  async createMany(payload: Prisma.ClassModuleMapCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.classModuleMap.createMany(payload);
  }

  async update(payload: Prisma.ClassModuleMapUpdateArgs): Promise<ClassModuleMap> {
    return await this.prisma.classModuleMap.update(payload);
  }

  async delete(payload: Prisma.ClassModuleMapDeleteArgs): Promise<ClassModuleMap> {
    return await this.prisma.classModuleMap.delete(payload);
  }

  async count(query: Prisma.ClassModuleMapCountArgs): Promise<number> {
    return await this.prisma.classModuleMap.count(query);
  }
}

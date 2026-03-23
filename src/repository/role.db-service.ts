import { Injectable } from '@nestjs/common';
import { Prisma, Role } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique<T extends Prisma.RoleFindUniqueArgs>(query: T) {
    return this.prisma.role.findUnique(query);
  }

  async findFirst(query: Prisma.RoleFindFirstArgs): Promise<Role | null> {
    return await this.prisma.role.findFirst(query);
  }

  async findMany(query: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return await this.prisma.role.findMany(query);
  }
  async create(payload: Prisma.RoleCreateArgs): Promise<Role> {
    return await this.prisma.role.create(payload);
  }

  async createMany(payload: Prisma.RoleCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.role.createMany(payload);
  }

  async update(payload: Prisma.RoleUpdateArgs): Promise<Role> {
    return await this.prisma.role.update(payload);
  }

  async delete(payload: Prisma.RoleDeleteArgs): Promise<Role> {
    return await this.prisma.role.delete(payload);
  }
}

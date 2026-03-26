import { Injectable } from '@nestjs/common';
import { Prisma, Tenant } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TenantDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.TenantFindUniqueArgs): Promise<Tenant | null> {
    return await this.prisma.tenant.findUnique(query);
  }

  async findFirst(query: Prisma.TenantFindFirstArgs): Promise<Tenant | null> {
    return await this.prisma.tenant.findFirst(query);
  }

  async findMany(query: Prisma.TenantFindManyArgs): Promise<Tenant[]> {
    return await this.prisma.tenant.findMany(query);
  }
  async create(payload: Prisma.TenantCreateArgs): Promise<Tenant> {
    return await this.prisma.tenant.create(payload);
  }

  async createMany(payload: Prisma.TenantCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.tenant.createMany(payload);
  }

  async update(payload: Prisma.TenantUpdateArgs): Promise<Tenant> {
    return await this.prisma.tenant.update(payload);
  }

  async delete(payload: Prisma.TenantDeleteArgs): Promise<Tenant> {
    return await this.prisma.tenant.delete(payload);
  }

  async count(query: Prisma.TenantCountArgs): Promise<number> {
    return await this.prisma.tenant.count(query);
  }
}

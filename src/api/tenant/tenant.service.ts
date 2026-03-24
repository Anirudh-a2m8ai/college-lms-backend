import { Injectable } from '@nestjs/common';
import { TenantDbService } from 'src/repository/tenant.db-service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { plainToInstance } from 'class-transformer';
import { TenantResponse } from './response/tenant.type';

@Injectable()
export class TenantService {
  constructor(private readonly tenantDbService: TenantDbService) {}

  async create(payload: CreateTenantDto) {
    const existingTenant = await this.tenantDbService.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (existingTenant) {
      throw new Error('Tenant already exists');
    }
    const tenant = await this.tenantDbService.create({
      data: {
        ...payload,
        hMac: crypto.randomUUID(),
      },
    });
    const createdTenant = await this.tenantDbService.findUnique({
      where: {
        id: tenant.id,
      },
    });
    return plainToInstance(TenantResponse, createdTenant);
  }
}

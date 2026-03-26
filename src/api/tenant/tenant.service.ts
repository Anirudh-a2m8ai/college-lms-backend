import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantDbService } from 'src/repository/tenant.db-service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { plainToInstance } from 'class-transformer';
import { TenantResponse } from './response/tenant.type';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { UpdateTenantDto } from './dto/update-tenant.dto';

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
      throw new BadRequestException('Tenant already exists');
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
    const tenantResponse = plainToInstance(TenantResponse, createdTenant);
    return {
      message: 'Tenant created successfully',
      data: tenantResponse,
    };
  }

  async findOne(id: string) {
    const tenant = await this.tenantDbService.findUnique({
      where: {
        id,
      },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return plainToInstance(TenantResponse, tenant);
  }

  async findAll(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    if (user.tenantId) {
      filterInput.tenantId = user.tenantId;
    }

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.tenantDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
      }),
      this.tenantDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(TenantResponse, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async update(id: string, payload: UpdateTenantDto) {
    const existingTenant = await this.tenantDbService.findUnique({
      where: {
        id,
      },
    });
    if (!existingTenant) {
      throw new NotFoundException('Tenant not found');
    }
    const tenant = await this.tenantDbService.update({
      where: {
        id,
      },
      data: payload,
    });
    const tenantResponse = plainToInstance(TenantResponse, tenant);
    return {
      message: 'Tenant updated successfully',
      data: tenantResponse,
    };
  }

  async delete(id: string) {
    const existingTenant = await this.tenantDbService.findUnique({
      where: {
        id,
      },
    });
    if (!existingTenant) {
      throw new NotFoundException('Tenant not found');
    }
    await this.tenantDbService.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return { message: 'Tenant deleted successfully' };
  }
}

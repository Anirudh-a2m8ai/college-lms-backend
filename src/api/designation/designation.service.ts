import { Injectable, NotFoundException } from '@nestjs/common';
import { DesignationDbService } from 'src/repository/designation.db-service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { plainToInstance } from 'class-transformer';
import { DesignationResponse } from './response/designation.type';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@Injectable()
export class DesignationService {
  constructor(private readonly designationDbService: DesignationDbService) {}

  async create(payload: CreateDesignationDto, user: any) {
    const isExist = await this.designationDbService.findFirst({
      where: {
        title: payload.title,
        tenantId: user.tenantId ? user.tenantId : payload.tenantId,
        isDeleted: false,
      },
    });
    if (isExist) {
      throw new Error('Designation already exists');
    }

    const designation = await this.designationDbService.create({
      data: {
        ...payload,
        tenantId: user.tenantId ? user.tenantId : payload.tenantId,
      },
      include: {
        tenant: true,
      },
    });

    const designationResponse = plainToInstance(DesignationResponse, designation);

    return {
      message: 'Designation created successfully',
      data: designationResponse,
    };
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
      this.designationDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { tenant: true },
      }),
      this.designationDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(DesignationResponse, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async findOne(id: string) {
    const designation = await this.designationDbService.findUnique({
      where: {
        id,
      },
    });

    if (!designation) {
      throw new NotFoundException('Designation not found');
    }

    const designationResponse = plainToInstance(DesignationResponse, designation);

    return designationResponse;
  }

  async update(id: string, payload: UpdateDesignationDto) {
    const isExist = await this.designationDbService.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Designation not found');
    }
    const designation = await this.designationDbService.update({
      where: {
        id,
      },
      data: payload,
    });

    const designationResponse = plainToInstance(DesignationResponse, designation);

    return {
      message: 'Designation updated successfully',
      data: designationResponse,
    };
  }

  async delete(id: string) {
    const isExist = await this.designationDbService.findUnique({
      where: {
        id,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Designation not found');
    }
    await this.designationDbService.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return {
      message: 'Designation deleted successfully',
    };
  }
}

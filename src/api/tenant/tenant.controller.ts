import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('tenant')
@UseGuards(PermissionGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Permissions('tenant:create')
  @Post()
  async create(@Body() payload: CreateTenantDto) {
    return this.tenantService.create(payload);
  }
}

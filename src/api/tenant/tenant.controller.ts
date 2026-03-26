import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Controller('tenant')
@UseGuards(PermissionGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Permissions('tenant:create')
  @Post()
  async create(@Body() payload: CreateTenantDto) {
    return this.tenantService.create(payload);
  }

  @Permissions('tenant:read')
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Permissions('tenant:read')
  @Post('list')
  async findAll(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return this.tenantService.findAll(query, body, user);
  }

  @Permissions('tenant:edit')
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() payload: UpdateTenantDto) {
    return this.tenantService.update(id, payload);
  }

  @Permissions('tenant:delete')
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    return this.tenantService.delete(id);
  }
}

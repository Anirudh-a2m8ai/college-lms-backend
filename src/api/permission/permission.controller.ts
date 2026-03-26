import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('permission')
@UseGuards(PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permissions('permission:read')
  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }
}

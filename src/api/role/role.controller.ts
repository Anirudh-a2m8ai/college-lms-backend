import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@Controller('role')
@UseGuards(PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions('role:create')
  @Post()
  async create(@Body() payload: CreateRoleDto) {
    return await this.roleService.create(payload);
  }

  @Permissions('role:read')
  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }
}

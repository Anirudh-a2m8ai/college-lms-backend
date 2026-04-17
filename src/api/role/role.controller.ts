import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, RolePermissionDto } from './dto/create-role.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('role')
@UseGuards(PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Permissions('role:create')
  @Post()
  async create(@Body() payload: CreateRoleDto, @CurrentUser() user: any) {
    return await this.roleService.create(payload, user);
  }

  @Permissions('role:read')
  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }

  @Permissions('role:edit')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateRoleDto, @CurrentUser() user: any) {
    return await this.roleService.update(id, payload, user);
  }

  @Permissions('role:delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.roleService.delete(id);
  }

  @Permissions('role:edit')
  @Post('permission')
  async permissionToRole(@Body() body: RolePermissionDto) {
    return await this.roleService.permissionToRole(body);
  }
}

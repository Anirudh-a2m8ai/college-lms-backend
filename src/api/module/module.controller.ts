import { Controller, Post, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Body } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('module')
@UseGuards(PermissionGuard)
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @Permissions('course:create')
  async create(@Body() payload: CreateModuleDto, @CurrentUser() user: any) {
    return await this.moduleService.create(payload, user);
  }
}

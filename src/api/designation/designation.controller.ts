import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

@Controller('designation')
@UseGuards(PermissionGuard)
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Permissions('designation:create')
  @Post()
  async create(@Body() payload: CreateDesignationDto, @CurrentUser() user: any) {
    return await this.designationService.create(payload, user);
  }

  @Permissions('designation:read')
  @Post('list')
  async findAll(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.designationService.findAll(query, body, user);
  }

  @Permissions('designation:read')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.designationService.findOne(id);
  }
}

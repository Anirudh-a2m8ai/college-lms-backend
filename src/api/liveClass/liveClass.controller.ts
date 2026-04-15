import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LiveClassService } from './liveClass.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateLiveClassDto, StartLiveClassDto } from './dto/liveClass.dto';

@Controller('live-class')
@UseGuards(PermissionGuard)
export class LiveClassController {
  constructor(private readonly liveClassService: LiveClassService) {}

  @Permissions('liveClass:create')
  @Post()
  async create(@Body() payload: CreateLiveClassDto, @CurrentUser() user: any) {
    return await this.liveClassService.createLiveClass(payload, user);
  }

  @Permissions('liveClass:read')
  @Get()
  async findAll(@CurrentUser() user: any) {
    return await this.liveClassService.findAllLiveClass(user);
  }

	
}

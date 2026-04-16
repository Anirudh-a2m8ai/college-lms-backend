import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LiveClassService } from './liveClass.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateLiveClassDto, StartLiveClassDto } from './dto/liveClass.dto';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

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
  @Post('findAllLiveClass')
  async findAll(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.liveClassService.findAllLiveClass(query, body, user);
  }

  @Permissions('liveClass:read')
  @Post('enrolledLiveClasses')
  async enrolledLiveClasses(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.liveClassService.enrolledLiveClasses(query, body, user);
  }

  @Permissions('liveClass:read')
  @Post('hostLiveClassList')
  async hostLiveClassList(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.liveClassService.hostLiveClassList(query, body, user);
  }

  @Permissions('liveClass:read')
  @Post('classRoom')
  async classRoomLiveClasses(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.liveClassService.classRoomLiveClasses(query, body, user);
  }
}

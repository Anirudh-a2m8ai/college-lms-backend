import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ClassRoomService } from './classRoom.service';
import { CreateClassRoomDto } from './dto/create-classRoom.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

@Controller('class-room')
@UseGuards(PermissionGuard)
export class ClassRoomController {
  constructor(private readonly classRoomService: ClassRoomService) {}

  @Permissions('classRoom:create')
  @Post()
  async create(@Body() payload: CreateClassRoomDto, @CurrentUser() user: any) {
    return this.classRoomService.create(payload, user);
  }

  @Permissions('classRoom:read')
  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser() user: any) {
    return this.classRoomService.get(id, user);
  }

  @Permissions('classRoom:read')
  @Post('list')
  async list(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return this.classRoomService.list(query, body, user);
  }

  @Permissions('classRoom:read')
  @Post('')
}

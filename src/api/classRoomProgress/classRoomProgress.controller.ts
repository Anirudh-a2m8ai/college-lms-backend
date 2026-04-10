import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ClassRoomProgressService } from './classRoomProgress.service';
import { CreateClassRoomProgressDto } from './dto/classRoomProgress.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('classRoomProgress')
export class ClassRoomProgressController {
  constructor(private readonly classRoomProgressService: ClassRoomProgressService) {}

  @Permissions('classRoomProgress:create')
  @Post()
  async create(@Body() payload: CreateClassRoomProgressDto) {
    return this.classRoomProgressService.create(payload);
  }

  @Permissions('classRoomProgress:read')
  @Get('classRoom/:classRoomId')
  async getClassRoomProgress(@Param('classRoomId') classRoomId: string) {
    return this.classRoomProgressService.getClassRoomProgress(classRoomId);
  }

  @Permissions('classRoomProgress:read')
  @Get()
  async get(@Query('subTopicId') subTopicId: string, @Query('classRoomId') classRoomId: string) {
    return this.classRoomProgressService.get(subTopicId, classRoomId);
  }
}

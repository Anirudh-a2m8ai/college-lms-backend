import { Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Body } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TopicService } from './topic.service';
import { CreateTopicDto, CreateTopicInClassRoomDto, UpdateTopicDto } from './dto/create-topic.dto';

@Controller('topic')
@UseGuards(PermissionGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Permissions('course:create')
  async create(@Body() payload: CreateTopicDto, @CurrentUser() user: any) {
    return await this.topicService.create(payload, user);
  }

  @Patch()
  @Permissions('course:edit')
  async update(@Body() payload: UpdateTopicDto, @CurrentUser() user: any) {
    return await this.topicService.update(payload, user);
  }

  @Permissions('course:read')
  @Get('lesson')
  async findAll(@Query('lessonId') lessonId: string, @Query('courseVersionId') courseVersionId: string) {
    return await this.topicService.findAllTopicsInLesson(lessonId, courseVersionId);
  }

  @Get('classRoom')
  @Permissions('course:read')
  async findAllInClassRoom(@Query('classRoomId') classRoomId: string) {
    return await this.topicService.findAllTopicsInClassRoom(classRoomId);
  }

  @Post('classRoom')
  @Permissions('course:create')
  async createInClassRoom(@Body() payload: CreateTopicInClassRoomDto, @CurrentUser() user: any) {
    return await this.topicService.createInClassRoom(payload, user);
  }
}

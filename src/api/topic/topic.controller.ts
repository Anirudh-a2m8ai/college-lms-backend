import { Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Body } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';

@Controller('topic')
@UseGuards(PermissionGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Permissions('course:create')
  async create(@Body() payload: CreateTopicDto, @CurrentUser() user: any) {
    return await this.topicService.create(payload, user);
  }
}

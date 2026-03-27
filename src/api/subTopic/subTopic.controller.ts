import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubTopicService } from './subTopic.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateSubTopicDto } from './dto/create-subTopic.dto';

@Controller('sub-topic')
@UseGuards(PermissionGuard)
export class SubTopicController {
  constructor(private readonly subTopicService: SubTopicService) {}

  @Permissions('course:create')
  @Post()
  create(@Body() createSubTopicDto: CreateSubTopicDto, @CurrentUser() user: any) {
    return this.subTopicService.create(createSubTopicDto, user);
  }
}

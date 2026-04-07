import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SubTopicService } from './subTopic.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ConfirmUploadDto, CreateSubTopicDto, GetUploadUrlDto, UpdateSubTopicDto } from './dto/create-subTopic.dto';

@Controller('sub-topic')
@UseGuards(PermissionGuard)
export class SubTopicController {
  constructor(private readonly subTopicService: SubTopicService) {}

  @Permissions('course:create')
  @Post()
  create(@Body() createSubTopicDto: CreateSubTopicDto, @CurrentUser() user: any) {
    return this.subTopicService.create(createSubTopicDto, user);
  }

  @Permissions('course:edit')
  @Patch()
  update(@Body() updateSubTopicDto: UpdateSubTopicDto, @CurrentUser() user: any) {
    return this.subTopicService.update(updateSubTopicDto, user);
  }

  @Permissions('course:read')
  @Get('topic')
  async findAll(@Query('topicId') topicId: string, @Query('courseVersionId') courseVersionId: string) {
    return await this.subTopicService.findAllSubTopicsInTopic(topicId, courseVersionId);
  }

  @Permissions('course:edit')
  @Post('upload-url')
  async getUploadUrl(@Body() getUploadUrlDto: GetUploadUrlDto, @CurrentUser() user: any) {
    return await this.subTopicService.getUploadUrl(getUploadUrlDto, user);
  }

  @Permissions('course:edit')
  @Patch('confirm-upload')
  async confirmUpload(@Body() confirmUploadDto: ConfirmUploadDto) {
    return await this.subTopicService.confirmUpload(confirmUploadDto);
  }

  @Permissions('course:read')
  @Get('object-url')
  async getObjectUrl(@Query('fileKey') fileKey: string) {
    return await this.subTopicService.getObjectUrl(fileKey);
  }
}

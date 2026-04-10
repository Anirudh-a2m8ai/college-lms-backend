import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SubTopicService } from './subTopic.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  AbortMultipartUploadDto,
  CompleteMultipartUploadDto,
  ConfirmUploadDto,
  CreateSubTopicDto,
  CreateSubTopicInClassRoomDto,
  GetUploadPartUrlDto,
  GetUploadUrlDto,
  UpdateSubTopicDto,
} from './dto/create-subTopic.dto';

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

  @Permissions('course:edit')
  @Post('multipart/start')
  startMultipartUpload(@Body() getUploadUrlDto: GetUploadUrlDto) {
    return this.subTopicService.startMultipartUpload(getUploadUrlDto);
  }

  @Permissions('course:edit')
  @Post('multipart/part-url')
  getUploadPartUrl(@Body() getUploadPartUrlDto: GetUploadPartUrlDto) {
    return this.subTopicService.getUploadPartUrl(getUploadPartUrlDto);
  }

  @Permissions('course:edit')
  @Post('multipart/complete')
  completeMultipartUpload(@Body() completeMultipartUploadDto: CompleteMultipartUploadDto) {
    return this.subTopicService.completeMultipartUpload(completeMultipartUploadDto);
  }

  @Permissions('course:edit')
  @Post('multipart/abort')
  abortMultipartUpload(@Body() abortMultipartUploadDto: AbortMultipartUploadDto) {
    return this.subTopicService.abortMultipartUpload(abortMultipartUploadDto);
  }

  @Permissions('course:read')
  @Get('classRoom')
  async findAllInClassRoom(@Query('classRoomId') classRoomId: string) {
    return await this.subTopicService.findAllSubTopicsInClassRoom(classRoomId);
  }

  @Permissions('course:create')
  @Post('classRoom')
  async createInClassRoom(@Body() payload: CreateSubTopicInClassRoomDto, @CurrentUser() user: any) {
    return await this.subTopicService.createInClassRoom(payload, user);
  }
}

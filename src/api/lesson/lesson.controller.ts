import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateLessonDto, CreateLessonInClassRoomDto, UpdateLessonDto } from './dto/create-lesson.dto';

@Controller('lesson')
@UseGuards(PermissionGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Permissions('course:create')
  @Post()
  async create(@Body() payload: CreateLessonDto, @CurrentUser() user: any) {
    return await this.lessonService.create(payload, user);
  }

  @Permissions('course:edit')
  @Patch()
  async update(@Body() payload: UpdateLessonDto, @CurrentUser() user: any) {
    return await this.lessonService.update(payload, user);
  }

  @Permissions('course:read')
  @Get('chapter')
  async findAll(@Query('chapterId') chapterId: string, @Query('courseVersionId') courseVersionId: string) {
    return await this.lessonService.findAllLessonsInChapter(chapterId, courseVersionId);
  }

  @Permissions('course:read')
  @Get('classRoom')
  async findAllInClassRoom(@Query('classRoomId') classRoomId: string) {
    return await this.lessonService.findAllLessonsInClassChapter(classRoomId);
  }

  @Permissions('course:create')
  @Post('classRoom')
  async createInClassRoom(@Body() payload: CreateLessonInClassRoomDto, @CurrentUser() user: any) {
    return await this.lessonService.createInClassRoom(payload, user);
  }
}

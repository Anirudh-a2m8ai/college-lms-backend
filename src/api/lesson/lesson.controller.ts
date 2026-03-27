import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lesson')
@UseGuards(PermissionGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Permissions('course:create')
  @Post()
  async create(@Body() payload: CreateLessonDto, @CurrentUser() user: any) {
    return await this.lessonService.create(payload, user);
  }
}

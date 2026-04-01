import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto, UpdateChapterDto } from './dto/create-chapter.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('chapter')
@UseGuards(PermissionGuard)
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Permissions('course:create')
  @Post()
  async create(@Body() payload: CreateChapterDto, @CurrentUser() user: any) {
    return await this.chapterService.create(payload, user);
  }

  @Permissions('course:create')
  @Patch()
  async update(@Body() payload: UpdateChapterDto, @CurrentUser() user: any) {
    return await this.chapterService.update(payload, user);
  }

  @Permissions('course:read')
  @Get('module')
  async findAll(@Query('moduleId') moduleId: string, @Query('courseVersionId') courseVersionId: string) {
    return await this.chapterService.findAllChaptersInModule(moduleId, courseVersionId);
  }
}

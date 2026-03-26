import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
@UseGuards(PermissionGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Permissions('course:create')
  async create(@Body() payload: CreateCourseDto, @CurrentUser() user: any) {
    return this.courseService.create(payload, user);
  }

  @Permissions('course:read')
  @Post('list')
  async findAll(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.courseService.findAll(query, body, user);
  }

  @Permissions('course:read')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }

  @Permissions('course:edit')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateCourseDto, @CurrentUser() user: any) {
    return await this.courseService.update(id, payload, user);
  }

  @Permissions('course:delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.courseService.delete(id);
  }

  @Permissions('course:create')
  @Post('lesson-plan')
  async createLessonPlan(@Body() payload: any, @CurrentUser() user: any) {
    return await this.courseService.createLessonPlan(payload, user);
  }

  @Get('/course-version/:courseVersionId')
  async getCourseVersion(@Param('courseVersionId') courseVersionId: string) {
    return await this.courseService.getCourseVersion(courseVersionId);
  }

  @Permissions('course:edit')
  @Patch('/course-version/status/:courseVersionId')
  async updateCourseVersionStatus(
    @Param('courseVersionId') courseVersionId: string,
    @Body() payload: any,
    @CurrentUser() user: any,
  ) {
    return await this.courseService.updateCourseVersionStatus(courseVersionId, payload, user);
  }
}

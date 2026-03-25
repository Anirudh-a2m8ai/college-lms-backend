import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

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
}

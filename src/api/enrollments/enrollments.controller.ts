import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto, CreateEnrollmentInCourseVersionDto } from './dto/create-enrollments.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

@Controller('enrollments')
@UseGuards(PermissionGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Permissions('enrollments:create')
  @Post()
  async create(@Body() payload: CreateEnrollmentDto) {
    return await this.enrollmentsService.create(payload);
  }

  @Permissions('enrollments:create')
  @Post('bulk')
  async createBulk(@Body() payload: CreateEnrollmentDto[]) {
    return await this.enrollmentsService.createBulk(payload);
  }

  @Permissions('enrollments:create')
  @Post('courseVersion')
  async createInCourseVersion(@Body() payload: CreateEnrollmentInCourseVersionDto) {
    return await this.enrollmentsService.createInCourseVersion(payload);
  }

  @Get('course')
  async getAllEnrollments(@CurrentUser() user: any) {
    return await this.enrollmentsService.getAllEnrollments(user);
  }

  @Get('courseVersion')
  async getAllEnrollmentsInCourseVersion(@CurrentUser() user: any) {
    return await this.enrollmentsService.getAllUserEnrollmentsInCourseVersion(user);
  }

  @Get(':enrollmentId')
  async getEnrollment(@Param('enrollmentId') enrollmentId: string) {
    return await this.enrollmentsService.getEnrollment(enrollmentId);
  }

  @Post('listAll')
  async listAll(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return await this.enrollmentsService.listAll(query, body, user);
  }
}

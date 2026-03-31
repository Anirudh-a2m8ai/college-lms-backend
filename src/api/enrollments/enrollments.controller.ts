import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollments.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('enrollments')
@UseGuards(PermissionGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Permissions('enrollments:create')
  @Post()
  async create(@Body() payload: CreateEnrollmentDto) {
    return await this.enrollmentsService.create(payload);
  }

  @Get('course')
  async getAllEnrollments(@CurrentUser() user: any) {
    return await this.enrollmentsService.getAllEnrollments(user);
  }
}

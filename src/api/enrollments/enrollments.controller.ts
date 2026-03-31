import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollments.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('enrollments')
@UseGuards(PermissionGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Permissions('enrollments:create')
  @Post()
  async create(@Body() payload: CreateEnrollmentDto) {
    return await this.enrollmentsService.create(payload);
  }
}

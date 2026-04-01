import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserProgressService } from './userProgress.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateUserProgressDto } from './dto/create-userProgress.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('user-progress')
@UseGuards(PermissionGuard)
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Permissions('userProgress:create')
  @Post()
  async create(@Body() payload: CreateUserProgressDto, @CurrentUser() user: any) {
    return await this.userProgressService.create(payload, user);
  }

  @Permissions('userProgress:read')
  @Get('enrollment/:enrollmentId')
  async findAll(@Param('enrollmentId') enrollmentId: string, @CurrentUser() user: any) {
    return await this.userProgressService.findAll(enrollmentId, user);
  }

  @Permissions('userProgress:read')
  @Get()
  async findOne(@Query('subTopicId') subTopicId: string, @Query('enrollmentId') enrollmentId: string) {
    return await this.userProgressService.getUserProgress(subTopicId, enrollmentId);
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClassRoomService } from './classRoom.service';
import { CreateClassRoomDto } from './dto/create-classRoom.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('class-room')
@UseGuards(PermissionGuard)
export class ClassRoomController {
  constructor(private readonly classRoomService: ClassRoomService) {}

	@Permissions('class-room:create')
  @Post()
  async create(@Body() payload: CreateClassRoomDto, @CurrentUser() user: any) {
    return this.classRoomService.create(payload, user);
  }

	@Permissions('class-room:read')
	@Get(':/id')
	async get(@Param('id') id: string, @CurrentUser() user: any) {
		return this.classRoomService.get(id, user);
	}
}

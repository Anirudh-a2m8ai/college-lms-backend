import { Body, Controller, Post } from '@nestjs/common';
import { ClassRoomProgressService } from './classRoomProgress.service';
import { CreateClassRoomProgressDto } from './dto/classRoomProgress.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('classRoomProgress')
export class ClassRoomProgressController {
  constructor(private readonly classRoomProgressService: ClassRoomProgressService) {}

  @Permissions('classRoomProgress:create')
  @Post()
  async create(@Body() payload: CreateClassRoomProgressDto) {
    return this.classRoomProgressService.create(payload);
  }
}

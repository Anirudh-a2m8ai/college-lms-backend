import { Module } from '@nestjs/common';
import { ClassRoomController } from './classRoom.controll';
import { ClassRoomService } from './classRoom.service';
import { ClassRoomDbService } from 'src/repository/classRoom.db-service';

@Module({
  imports: [ClassRoomDbService],
  controllers: [ClassRoomController],
  providers: [ClassRoomService],
})
export class ClassRoomModule {}

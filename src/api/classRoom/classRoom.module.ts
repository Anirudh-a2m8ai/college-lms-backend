import { Module } from '@nestjs/common';
import { ClassRoomController } from './classRoom.controll';
import { ClassRoomService } from './classRoom.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [ClassRoomController],
  providers: [ClassRoomService],
})
export class ClassRoomModule {}

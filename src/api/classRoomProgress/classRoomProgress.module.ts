import { Module } from '@nestjs/common';
import { ClassRoomProgressController } from './classRoomProgress.controller';
import { ClassRoomProgressService } from './classRoomProgress.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [ClassRoomProgressController],
  providers: [ClassRoomProgressService],
})
export class ClassRoomProgressModule {}

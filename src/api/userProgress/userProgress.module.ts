import { Module } from '@nestjs/common';
import { UserProgressController } from './userProgress.controller';
import { UserProgressService } from './userProgress.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [UserProgressController],
  providers: [UserProgressService],
})
export class UserProgressModule {}

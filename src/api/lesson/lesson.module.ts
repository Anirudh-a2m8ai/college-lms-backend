import { Module } from '@nestjs/common';
import { DbServiceModule } from 'src/repository/db-service.module';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
  imports: [DbServiceModule],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}

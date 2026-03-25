import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

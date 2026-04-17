import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [ExamController],
  providers: [ExamService],
})
export class ExamModule {}

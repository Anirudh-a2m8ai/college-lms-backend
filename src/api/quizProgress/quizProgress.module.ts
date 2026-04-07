import { Module } from '@nestjs/common';
import { QuizProgressController } from './quizProgress.controller';
import { QuizProgressService } from './quizProgress.service';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [DbServiceModule],
  controllers: [QuizProgressController],
  providers: [QuizProgressService],
})
export class QuizProgressModule {}

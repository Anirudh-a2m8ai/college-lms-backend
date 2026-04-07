import { Controller, Get, Query } from '@nestjs/common';
import { QuizProgressService } from './quizProgress.service';

@Controller('quiz-progress')
export class QuizProgressController {
  constructor(private readonly quizProgressService: QuizProgressService) {}

  @Get()
  async getQuizProgress(@Query('quizId') quizId: string, @Query('enrollmentId') enrollmentId: string) {
    return this.quizProgressService.getQuizProgress(quizId, enrollmentId);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { QuizProgressService } from './quizProgress.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('quiz-progress')
export class QuizProgressController {
  constructor(private readonly quizProgressService: QuizProgressService) {}

  @Get()
  async getQuizProgress(@Query('quizId') quizId: string, @Query('enrollmentId') enrollmentId: string) {
    return this.quizProgressService.getQuizProgress(quizId, enrollmentId);
  }

  @Get('enrollment/:enrollmentId')
  async getQuizProgressByEnrollmentId(@Param('enrollmentId') enrollmentId: string) {
    return this.quizProgressService.getQuizProgressByEnrollmentId(enrollmentId);
  }
}

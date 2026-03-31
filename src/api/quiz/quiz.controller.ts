import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateQuizDto, CreateQuizQuestionDto } from './dto/create-quiz.dto';

@Controller('quiz')
@UseGuards(PermissionGuard)
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Permissions('course:create')
  @Post()
  async create(@Body() payload: CreateQuizDto) {
    return this.quizService.create(payload);
  }

  @Permissions('course:create')
  @Post(':quizId/quiz-question')
  async createQuizQuestion(@Param('quizId') quizId: string, @Body() payload: CreateQuizQuestionDto[]) {
    return this.quizService.createQuizQuestion(quizId, payload);
  }
}

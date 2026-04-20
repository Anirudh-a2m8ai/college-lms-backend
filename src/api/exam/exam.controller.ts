import { Controller, Post, Body, Req, UseGuards, Query, Param, Get } from '@nestjs/common';
import { ExamService } from './exam.service';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CreateExamDto, CreateExamSubmissionDto, CreateQuestionDto, EvaluateExamDto } from './dto/exam.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

@Controller('exam')
@UseGuards(PermissionGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Permissions('exam:create')
  @Post('create')
  async createExam(@Body() body: CreateExamDto, @CurrentUser() user: any) {
    return this.examService.createExam(body, user);
  }

  @Permissions('exam:read')
  @Post('listAll')
  async listAll(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return this.examService.listAll(query, body, user);
  }

  @Permissions('exam:read')
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.examService.findOne(id, user);
  }

  @Permissions('exam:read')
  @Post('listByStudent')
  async listByStudent(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return this.examService.listByStudent(query, body, user);
  }

  @Permissions('exam:create')
  @Post('createQuestion')
  async createQuestion(@Body() body: CreateQuestionDto[], @CurrentUser() user: any) {
    return this.examService.createQuestion(body, user);
  }

  @Permissions('exam:submit')
  @Post('started')
  async startedExam(@Body() body: { examId: string; enrollmentId: string }, @CurrentUser() user: any) {
    return this.examService.startedExam(body, user);
  }

  @Permissions('exam:submit')
  @Post('submit')
  async submitExam(@Body() body: CreateExamSubmissionDto, @CurrentUser() user: any) {
    return this.examService.submitExam(body, user);
  }

  @Permissions('exam:evaluate')
  @Post('evaluate')
  async evaluateExam(@Body() body: EvaluateExamDto, @CurrentUser() user: any) {
    return this.examService.evaluateExam(body, user);
  }

  @Permissions('exam:result')
  @Post('resultList')
  async resultList(@Query() query: SearchInputDto, @Body() body: any, @CurrentUser() user: any) {
    return this.examService.resultList(query, body, user);
  }

  @Permissions('exam:edit')
  @Post('publishResult')
  async publishResult(@Body() body: { examId: string }, @CurrentUser() user: any) {
    return this.examService.publishResult(body, user);
  }
}

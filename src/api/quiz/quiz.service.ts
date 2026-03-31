import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuizDbService } from 'src/repository/quiz.db-service';
import { CreateQuizDto, CreateQuizQuestionDto } from './dto/create-quiz.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { QuizResponseDto } from './response/quiz.type';
import { QuizQuestionDbService } from 'src/repository/quiz-question.db-service';
import { QuizQuestionResponseDto } from './response/quiz-question.type';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizDbService: QuizDbService,
    private readonly courseVersionDbService: CourseVersionDbService,
    private readonly quizQuestionDbService: QuizQuestionDbService,
  ) {}

  async create(payload: CreateQuizDto) {
    const courseVersion = await this.courseVersionDbService.findFirst({
      where: {
        id: payload.courseVersionId,
      },
    });
    if (!courseVersion) {
      throw new BadRequestException('Course version not found');
    }
    this.validateQuizParent({
      moduleId: payload.moduleId,
      chapterId: payload.chapterId,
      lessonId: payload.lessonId,
      topicId: payload.topicId,
      subTopicId: payload.subTopicId,
    });
    const questionPattern = payload.questionPattern ? instanceToPlain(payload.questionPattern) : undefined;
    const quiz = await this.quizDbService.create({
      data: {
        title: payload.title,
        description: payload.description,
        quizType: payload.quizType,
        difficulty: payload.difficulty,
        passPercentage: payload.passPercentage,
        timeLimitInSeconds: payload.timeLimitInSeconds,
        noOfAttempt: payload.noOfAttempt,
        questionPattern,
        orderIndex: payload.orderIndex,
        courseVersionId: payload.courseVersionId,
        moduleId: payload.moduleId,
        chapterId: payload.chapterId,
        lessonId: payload.lessonId,
        topicId: payload.topicId,
        subTopicId: payload.subTopicId,
      },
    });
    await this.courseVersionDbService.update({
      where: { id: courseVersion.id },
      data: {
        quizCount: (courseVersion?.quizCount || 0) + 1,
      },
    });
    const quizResponse = plainToInstance(QuizResponseDto, quiz);
    return {
      quiz: quizResponse,
      message: 'Quiz created successfully',
    };
  }

  async createQuizQuestion(quizId: string, payload: CreateQuizQuestionDto[]) {
    const quiz = await this.quizDbService.findUnique({
      where: { id: quizId },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    if (payload.length !== quiz.noOfQuestions) {
      throw new BadRequestException(
        `Quiz must contain exactly ${quiz.noOfQuestions} questions. Received ${payload.length}.`,
      );
    }
    const quizQuestionData = payload.map((quizQuestion) => ({
      question: quizQuestion.question,
      quizId: quizId,
      questionType: quizQuestion.questionType,
      options: quizQuestion.options.map((opt) => JSON.stringify(opt)),
      correctAnswer: quizQuestion.correctAnswer,
    }));
    const createQuizQuestion = await this.quizQuestionDbService.createManyAndReturn({
      data: quizQuestionData,
    });
    const quizQuestionResponse = plainToInstance(QuizQuestionResponseDto, createQuizQuestion, {
      excludeExtraneousValues: true,
    });
    return {
      quizQuestion: quizQuestionResponse,
      message: 'Quiz question created successfully',
    };
  }

  private validateQuizParent(data: {
    moduleId?: string;
    chapterId?: string;
    lessonId?: string;
    topicId?: string;
    subTopicId?: string;
  }) {
    const count = [data.moduleId, data.chapterId, data.lessonId, data.topicId, data.subTopicId].filter(Boolean).length;

    if (count !== 1) {
      throw new BadRequestException('Quiz must belong to exactly one parent');
    }
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuizDbService } from 'src/repository/quiz.db-service';
import { CreateQuizDto, CreateQuizQuestionDto, CreateQuizSubmissionDto } from './dto/create-quiz.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { CourseVersionDbService } from 'src/repository/courseVersion.db-service';
import { QuizResponseDto } from './response/quiz.type';
import { QuizQuestionDbService } from 'src/repository/quiz-question.db-service';
import { QuizQuestionResponseDto } from './response/quiz-question.type';
import { QuizSubmissionDbService } from 'src/repository/quizSubmission.db-service';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizStatus } from 'src/generated/prisma/enums';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizDbService: QuizDbService,
    private readonly courseVersionDbService: CourseVersionDbService,
    private readonly quizQuestionDbService: QuizQuestionDbService,
    private readonly quizSubmissionDbService: QuizSubmissionDbService,
  ) {}

  async create(payload: CreateQuizDto) {
    const courseVersion = await this.courseVersionDbService.findFirst({
      where: {
        id: payload.courseVersionId,
      },
    });
    const existingQuizIndex = await this.quizDbService.findFirst({
      where: {
        courseVersionId: payload.courseVersionId,
        orderIndex: payload.orderIndex,
        moduleId: payload.moduleId,
        chapterId: payload.chapterId,
        lessonId: payload.lessonId,
        topicId: payload.topicId,
        subTopicId: payload.subTopicId,
      },
    });
    if (existingQuizIndex) {
      throw new BadRequestException('Quiz index already exists');
    }
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
        noOfQuestions: payload.noOfQuestions,
        orderIndex: payload.orderIndex,
        courseVersionId: payload.courseVersionId,
        moduleId: payload.moduleId,
        chapterId: payload.chapterId,
        lessonId: payload.lessonId,
        topicId: payload.topicId,
        subTopicId: payload.subTopicId,
        status: payload.status,
        deadLine: payload.deadLine,
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
    console.log(payload.length);
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

  async createQuizSubmission(payload: CreateQuizSubmissionDto, user: any) {
    const quiz = await this.quizDbService.findUnique({
      where: {
        id: payload.quizId,
      },
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz not found for ${payload.quizId}`);
    }

    if (quiz?.deadLine && quiz.deadLine < new Date()) {
      throw new BadRequestException('Quiz is closed');
    }

    if (quiz.status !== QuizStatus.ENABLED) {
      throw new BadRequestException('Quiz is not enabled');
    }

    const questionIds = payload.quizSubmission.map((submission) => submission.quizQuestionId);
    const questions = await this.quizQuestionDbService.findMany({
      where: {
        id: { in: questionIds },
      },
    });

    if (questions.length < questionIds.length) {
      throw new BadRequestException('Invalid quiz question detected');
    }

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const quizSubmission = await this.quizSubmissionDbService.createSubmission({
      enrollmentId: payload.enrollmentId,
      quiz: quiz,
      quizSubmission: payload.quizSubmission,
      userId: user.userId,
      questionMap: questionMap,
    });

    return quizSubmission;
  }

  async update(id: string, payload: UpdateQuizDto) {
    const existingQuiz = await this.quizDbService.findUnique({
      where: { id },
    });
    if (!existingQuiz) {
      throw new NotFoundException('Quiz not found');
    }
    const quiz = await this.quizDbService.update({
      where: { id },
      data: payload,
    });
    const quizResponse = plainToInstance(QuizResponseDto, quiz);
    return {
      quiz: quizResponse,
      message: 'Quiz updated successfully',
    };
  }
}

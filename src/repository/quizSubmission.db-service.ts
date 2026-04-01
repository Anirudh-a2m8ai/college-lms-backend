import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Quiz, QuizSubmission } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';
import { evaluateAnswer } from 'src/utils/check-answers.util';

type QuizSubmissionType = {
  enrollmentId: string;
  quiz: Quiz;
  quizSubmission: any;
  userId: string;
  questionMap: any;
};

@Injectable()
export class QuizSubmissionDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.QuizSubmissionFindUniqueArgs): Promise<QuizSubmission | null> {
    return await this.prisma.quizSubmission.findUnique(query);
  }

  async findFirst(query: Prisma.QuizSubmissionFindFirstArgs): Promise<QuizSubmission | null> {
    return await this.prisma.quizSubmission.findFirst(query);
  }

  async findMany(query: Prisma.QuizSubmissionFindManyArgs): Promise<QuizSubmission[]> {
    return await this.prisma.quizSubmission.findMany(query);
  }

  async create(payload: Prisma.QuizSubmissionCreateArgs): Promise<QuizSubmission> {
    return await this.prisma.quizSubmission.create(payload);
  }

  async createMany(payload: Prisma.QuizSubmissionCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.quizSubmission.createMany(payload);
  }

  async update(payload: Prisma.QuizSubmissionUpdateArgs): Promise<QuizSubmission> {
    return await this.prisma.quizSubmission.update(payload);
  }

  async delete(payload: Prisma.QuizSubmissionDeleteArgs): Promise<QuizSubmission> {
    return await this.prisma.quizSubmission.delete(payload);
  }

  async count(query: Prisma.QuizSubmissionCountArgs): Promise<number> {
    return await this.prisma.quizSubmission.count(query);
  }

  async createSubmission(input: QuizSubmissionType) {
    return await this.prisma.$transaction(
      async (tx) => {
        let quizProgress;
        quizProgress = await tx.quizProgress.findFirst({
          where: {
            enrollmentId: input.enrollmentId,
            quizId: input.quiz.id,
          },
        });
        if (!quizProgress) {
          quizProgress = await tx.quizProgress.create({
            data: {
              enrollmentId: input.enrollmentId,
              quizId: input.quiz.id,
              isCompleted: true,
            },
          });
        }
        const quizAttempt = await tx.quizAttempt.findFirst({
          where: {
            quizId: input.quiz.id,
            quizProgressId: quizProgress.id,
          },
          orderBy: {
            attemptNumber: 'desc',
          },
        });

        if (quizAttempt?.attemptNumber === input.quiz.noOfAttempt) {
          throw new BadRequestException('You have reached the max attempt');
        }

        const numberOfAttempt = quizAttempt ? quizAttempt.attemptNumber + 1 : 1;
        const attemptLeft = input.quiz.noOfAttempt - numberOfAttempt;

        const createdAttempt = await tx.quizAttempt.create({
          data: {
            quizId: input.quiz.id,
            attemptNumber: numberOfAttempt,
            quizProgressId: quizProgress.id,
          },
        });
        const rows = input.quizSubmission.map((s) => {
          const question = input.questionMap.get(s.quizQuestionId)!;

          const isCorrect = evaluateAnswer(question, s.answer);

          return {
            quizQuestionId: s.quizQuestionId,
            answer: s.answer,
            isCorrect,
            attemptId: createdAttempt.id,
          };
        });
        const submittedAnswers = await tx.quizSubmission.createManyAndReturn({
          data: rows,
        });
        const totalQuestions = rows.length;
        const correctAnswer = rows.reduce((count, row) => count + (row.isCorrect ? 1 : 0), 0);
        const percentage = totalQuestions === 0 ? 0 : Number(((correctAnswer / totalQuestions) * 100).toFixed(2));

        await tx.quizAttempt.update({
          where: {
            id: createdAttempt.id,
          },
          data: {
            score: percentage,
          },
        });
        if (quizProgress.highScore < percentage) {
          await tx.quizProgress.update({
            where: {
              id: quizProgress.id,
            },
            data: {
              highScore: percentage,
            },
          });
        }
        return {
          submittedAnswers,
          score: percentage,
          attemptNumber: numberOfAttempt,
          attemptLeft: attemptLeft,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 60_000,
      },
    );
  }
}

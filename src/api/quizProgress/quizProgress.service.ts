import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { QuizAttempt, quizProgress } from 'src/generated/prisma/client';
import { QuizProgressDbService } from 'src/repository/quizProgress.db-service';
import { QuizProgressResponseDto } from './response/quiz-progress.type';

@Injectable()
export class QuizProgressService {
  constructor(private readonly quizProgressDbService: QuizProgressDbService) {}

  async getQuizProgress(quizId: string, enrollmentId: string) {
    const quizProgress = (await this.quizProgressDbService.findFirst({
      where: {
        quizId,
        enrollmentId,
      },
      include: {
        attempts: true,
      },
    })) as quizProgress & { attempts: QuizAttempt[] };

    const progress = {
      ...quizProgress,
      totalAttempts: quizProgress?.attempts.length,
    };

    const quizProgressResponseDto = plainToInstance(QuizProgressResponseDto, progress);
    return {
      message: 'Quiz progress fetched successfully',
      data: quizProgressResponseDto,
    };
  }

  async getQuizProgressByEnrollmentId(enrollmentId: string, user: any) {
    const quizProgress = (await this.quizProgressDbService.findMany({
      where: {
        enrollmentId,
        userId: user.id,
      },
      include: {
        attempts: true,
      },
    })) as (quizProgress & { attempts: QuizAttempt[] })[];

    const progress = quizProgress.map((quizProgress) => {
      return {
        ...quizProgress,
        totalAttempts: quizProgress?.attempts.length,
      };
    });

    const quizProgressResponseDto = plainToInstance(QuizProgressResponseDto, progress);
    return {
      message: 'Quiz progress fetched successfully',
      data: quizProgressResponseDto,
    };
  }
}

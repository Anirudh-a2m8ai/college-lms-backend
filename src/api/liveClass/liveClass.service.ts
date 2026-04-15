import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LiveClassDbService } from 'src/repository/liveClass.db-service';
import { CreateLiveClassDto, StartLiveClassDto } from './dto/liveClass.dto';
import { plainToInstance } from 'class-transformer';
import { LiveClassResponseDto } from './response/liveClass.type';
import { EnrollmentsDbService } from 'src/repository/enrollments.db-service';

const now = new Date();
const ONE_HOUR = 60 * 60 * 1000;
@Injectable()
export class LiveClassService {
  constructor(
    private readonly liveClassDbService: LiveClassDbService,
    private readonly enrollmentsDbService: EnrollmentsDbService,
  ) {}

  async createLiveClass(payload: CreateLiveClassDto, user: any) {
    const liveClass = await this.liveClassDbService.create({
      data: {
        startTime: payload.startTime,
        endTime: payload.endTime,
        classRoomId: payload.classRoomId,
        hostId: payload.hostId,
      },
    });

    const liveClassResponse = plainToInstance(LiveClassResponseDto, liveClass);

    return {
      message: 'Live class created successfully',
      data: liveClassResponse,
    };
  }

  async findAllLiveClass(user: any) {
    const liveClasses = await this.liveClassDbService.findMany({
      where: {
        isDeleted: false,
        status: {
          not: 'COMPLETED',
        },
        endTime: {
          gte: new Date(now.getTime() - ONE_HOUR),
        },
      },
    });

    const liveClassResponse = plainToInstance(LiveClassResponseDto, liveClasses);

    return {
      message: 'Live classes fetched successfully',
      data: liveClassResponse,
    };
  }

  async joinLiveClass(userId: string, liveClassId: string) {
    const liveClass = await this.liveClassDbService.findUnique({
      where: {
        id: liveClassId,
      },
      include: {
        classRoom: true,
      },
    });

    if (!liveClass) {
      throw new NotFoundException('Live class not found');
    }

    const userClassRoom = await this.enrollmentsDbService.findFirst({
      where: {
        classRoomId: liveClass.classRoomId,
        userId: userId,
      },
    });

		if (!userClassRoom) {
			throw new UnauthorizedException('User not authorized user')
		}

		return true;
  }
}

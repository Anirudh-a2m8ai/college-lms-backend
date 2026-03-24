import { BadRequestException, Injectable } from '@nestjs/common';
import { UserDbService } from 'src/repository/user.db-service';
import { CreateUserBulkDto, CreateUserDto } from './dto/create-user.dto';
import { AccountStatus, RoleType, TokenType } from 'src/generated/prisma/enums';
import { plainToInstance } from 'class-transformer';
import { UserPermissionsResponseDto, UserResponseDto } from './response/user.type';
import { QueueService } from 'src/queue/queue.service';
import { SentUserOtpDto, SetUserPasswordDto } from './dto/user.dto';
import { generateToken, hashToken } from 'src/utils/generate-token.util';
import { UserTokenDbService } from 'src/repository/user-token.db-service';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/generated/prisma/client';
import { generateRandomPassword } from 'src/utils/generate-password.util';

@Injectable()
export class UserService {
  constructor(
    private readonly userDbService: UserDbService,
    private readonly queueService: QueueService,
    private readonly userTokenDbService: UserTokenDbService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let existingUser = await this.userDbService.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    if (createUserDto.username) {
      const existingUsername = await this.userDbService.findFirst({
        where: { username: createUserDto.username },
      });

      if (existingUsername) {
        throw new BadRequestException('Username already taken');
      }
    }
    const { hashedPassword } = await generateRandomPassword();
    const user = await this.userDbService.create({
      data: {
        ...createUserDto,
        passwordHash: hashedPassword,
        status: AccountStatus.INACTIVE,
        roleId: createUserDto.roleId,
      },
    });

    const userResponse = plainToInstance(UserResponseDto, user);

    return {
      message: 'User created successfully',
      data: userResponse,
    };
  }

  async sendUserOtp(payload: SentUserOtpDto) {
    const user = await this.userDbService.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await this.userDbService.update({
      where: {
        id: user.id,
      },
      data: {
        otp: otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await this.queueService.addSendOtpMailJob({ to: user.email, otp });
    return {
      message: 'OTP sent successfully',
    };
  }

  async verifyUserOtp(payload: any) {
    const user = await this.userDbService.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    if (user.otp !== payload.otp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    const { rawToken, hashedToken, expiry } = generateToken(24 * 60);
    await this.userDbService.update({
      where: {
        id: user.id,
      },
      data: {
        otp: null,
        otpExpiresAt: null,
        isEmailVerified: true,
        status: AccountStatus.ACTIVE,
      },
    });
    await this.userTokenDbService.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: expiry,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return {
      message: 'OTP verified successfully',
      data: {
        token: rawToken,
        expiry: expiry,
      },
    };
  }

  async setPassword(payload: SetUserPasswordDto, token: string) {
    if (!token) throw new BadRequestException('Token missing');
    const hashedToken = hashToken(token);
    const userToken = await this.userTokenDbService.findUnique({
      where: {
        token: hashedToken,
      },
      include: {
        user: true,
      },
    });
    if (!userToken) {
      throw new BadRequestException('Unauthorized user');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);
    await this.userDbService.update({
      where: {
        id: userToken.userId,
      },
      data: {
        passwordHash: hashedPassword,
      },
    });
    await this.userTokenDbService.delete({
      where: {
        id: userToken.id,
      },
    });
    return {
      message: 'Password set successfully',
    };
  }

  async handleBulkUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const filePath = this.saveFile(file);
    console.log(filePath);

    const job = await this.queueService.addBulkUploadJob(filePath);

    return {
      message: 'File uploaded. Processing started.',
      jobId: job.id,
    };
  }

  async createUsersBulk(users: CreateUserBulkDto[]): Promise<{ success: number }> {
    const BATCH_SIZE = 500;
    let totalInserted = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const chunk = users.slice(i, i + BATCH_SIZE);

      const result = await this.userDbService.createMany({
        data: chunk,
        skipDuplicates: true,
      });

      totalInserted += result.count;
    }

    return { success: totalInserted };
  }

  async findOne(id: string) {
    const user = await this.userDbService.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async getPermissions(id: string) {
    const user = (await this.userDbService.findUnique({
      where: {
        id,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })) as User & { role: { permissions: string[] } };
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const permissionResponse = plainToInstance(UserPermissionsResponseDto, user.role.permissions, {
      excludeExtraneousValues: true,
    });
    return permissionResponse;
  }

  private saveFile(file: Express.Multer.File): string {
    const uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      console.log('hi');
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.random()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }
}

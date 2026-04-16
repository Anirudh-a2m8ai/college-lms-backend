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
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationMapper } from 'src/utils/search/pagination.mapper';
import { OrderMapper } from 'src/utils/search/order.mapper';
import { FilterMapper } from 'src/utils/search/filter.mapper';
import { PaginationResponse } from 'src/utils/search/pagination.response';
import { SearchInputDto } from 'src/utils/search/search.input.dto';

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
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        username: createUserDto.username,
        bio: createUserDto.bio,
        passwordHash: hashedPassword,
        status: AccountStatus.INACTIVE,
        tenant: {
          connect: { id: createUserDto.tenantId },
        },
        role: {
          connect: createUserDto.roleIds.map((id) => ({ id })),
        },
      },
      include: {
        role: true,
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
        isPasswordChanged: true,
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userDbService.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    const { roleIds, socialLinks, ...rest } = updateUserDto;
    const updatedUser = await this.userDbService.update({
      where: {
        id,
      },
      data: {
        ...rest,

        ...(socialLinks && {
          socialLinks: {
            create: socialLinks,
          },
        }),

        ...(roleIds && {
          role: {
            set: roleIds.map((id) => ({ id })),
          },
        }),
      },
    });
    const userResponse = plainToInstance(UserResponseDto, updatedUser, {
      excludeExtraneousValues: true,
    });
    return {
      message: 'User updated successfully',
      data: userResponse,
    };
  }

  async delete(id: string) {
    const existingUser = await this.userDbService.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    await this.userDbService.update({
      where: {
        id,
      },
      data: {
        status: AccountStatus.INACTIVE,
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return {
      message: 'User deleted successfully',
    };
  }

  async suspend(id: string) {
    const existingUser = await this.userDbService.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    await this.userDbService.update({
      where: {
        id,
      },
      data: {
        status: AccountStatus.SUSPENDED,
      },
    });
    return {
      message: 'User suspended successfully',
    };
  }

  async findAll(query: SearchInputDto, body: any, user: any) {
    const pagination = PaginationMapper(query);
    const orderBy = OrderMapper(query);

    let filterInput = body?.filter ? { ...body.filter } : {};

    if (user.tenantId) {
      filterInput.tenantId = user.tenantId;
    }

    const where = FilterMapper(filterInput, query);

    const [data, total] = await Promise.all([
      this.userDbService.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: { role: true },
      }),
      this.userDbService.count({ where }),
    ]);

    const sendData = {
      data: plainToInstance(UserResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      total,
      pagination,
    };

    return PaginationResponse(sendData);
  }

  async findAllUsers(user: any) {
    let data;
    if (user.tenantId) {
      data = await this.userDbService.findMany({
        where: {
          tenantId: user.tenantId,
          status: AccountStatus.ACTIVE,
          isDeleted: false,
        },
        include: { role: true },
      });
    } else {
      data = await this.userDbService.findMany({
        where: {
          status: AccountStatus.ACTIVE,
          isDeleted: false,
        },
        include: { role: true },
      });
    }
    return plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async findAllUsersByRole(role: string, user: any) {
    let data;
    if (user.tenantId) {
      data = await this.userDbService.findMany({
        where: {
          tenantId: user.tenantId,
          status: AccountStatus.ACTIVE,
          isDeleted: false,
          role: {
            some: {
              role: role,
            },
          },
        },
        include: { role: true },
      });
    } else {
      data = await this.userDbService.findMany({
        where: {
          status: AccountStatus.ACTIVE,
          isDeleted: false,
          role: {
            some: {
              role: role,
            },
          },
        },
        include: { role: true },
      });
    }
    return plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  private saveFile(file: Express.Multer.File): string {
    const uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.random()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }
}

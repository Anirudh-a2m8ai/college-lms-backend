import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'src/generated/prisma/client';
import { BatchPayload } from 'src/generated/prisma/internal/prismaNamespace';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserDbService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(query: Prisma.UserFindUniqueArgs): Promise<User | null> {
    return await this.prisma.user.findUnique(query);
  }

  async findFirst(query: Prisma.UserFindFirstArgs): Promise<User | null> {
    return await this.prisma.user.findFirst(query);
  }

  async findMany(query: Prisma.UserFindManyArgs): Promise<User[]> {
    return await this.prisma.user.findMany(query);
  }
  async create(payload: Prisma.UserCreateArgs): Promise<User> {
    return await this.prisma.user.create(payload);
  }

  async createMany(payload: Prisma.UserCreateManyArgs): Promise<BatchPayload> {
    return await this.prisma.user.createMany(payload);
  }

  async update(payload: Prisma.UserUpdateArgs): Promise<User> {
    return await this.prisma.user.update(payload);
  }

  async count(payload: Prisma.UserCountArgs): Promise<number> {
    return await this.prisma.user.count(payload);
  }
}

import { Injectable } from "@nestjs/common";
import { Prisma, UserToken } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserTokenDbService {
  constructor(private readonly prisma: PrismaService) {}

    async findUnique(query: Prisma.UserTokenFindUniqueArgs): Promise<UserToken | null> {
    return await this.prisma.userToken.findUnique(query);
  }

  async findFirst(query: Prisma.UserTokenFindFirstArgs): Promise<UserToken | null> {
    return await this.prisma.userToken.findFirst(query);
  }

  async findMany(query: Prisma.UserTokenFindManyArgs): Promise<UserToken[]> {
    return await this.prisma.userToken.findMany(query);
  }
  async create(payload: Prisma.UserTokenCreateArgs): Promise<UserToken> {
    return await this.prisma.userToken.create(payload);
  }

  async update(payload: Prisma.UserTokenUpdateArgs): Promise<UserToken> {
    return await this.prisma.userToken.update(payload);
  }

  async delete(query: Prisma.UserTokenDeleteArgs): Promise<UserToken> {
    return await this.prisma.userToken.delete(query);
  }
}
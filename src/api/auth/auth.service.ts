import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-dto';
import { UserDbService } from 'src/repository/user.db-service';
import { UserTokenDbService } from 'src/repository/user-token.db-service';
import { AccountStatus, RoleType, TokenType } from 'src/generated/prisma/enums';
import { compare } from 'bcrypt';
import { hashToken } from 'src/utils/generate-token.util';
import { Request, Response } from 'express';
import { RoleDbService } from 'src/repository/role.db-service';
import { Permission, Role, User } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userDbService: UserDbService,
    private readonly userTokenDbService: UserTokenDbService,
    private readonly roleDbService: RoleDbService,
  ) {}

  async loginUser(loginDto: LoginDto, req: Request, res: Response) {
    const { email, password } = loginDto;
    const user = (await this.userDbService.findFirst({
      where: {
        email: email,
      },
      include: {
        role: true,
      },
    })) as User & { role: Role[] };
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.status === AccountStatus.INACTIVE) {
      throw new BadRequestException('User is inactive');
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const userPermissions = (await this.roleDbService.findMany({
      where: {
        id: {
          in: user.role.map((role) => role.id),
        },
      },
      include: {
        permissions: true,
      },
    })) as (Role & { permissions: Permission[] })[];

    const permissionNames = [
      ...new Set(userPermissions.flatMap((role) => role.permissions.map((permission) => permission.name))),
    ];

    const roleName = [...new Set(userPermissions.flatMap((role) => (role.isSystemDefined ? [role.role] : [])))];

    const tokenPayload = {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: roleName[0],
      permissions: permissionNames,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as unknown as number,
    });

    const newRefreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as unknown as number,
    });
    const hashedRefreshToken = hashToken(newRefreshToken);

    // Create new refresh token in database
    await this.userTokenDbService.create({
      data: {
        userId: user.id,
        token: hashedRefreshToken,
        type: TokenType.REFRESH,
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';
    if (req.cookies?.refreshToken) {
      res.clearCookie('refreshToken', {
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
        httpOnly: true,
      });
    }

    res.cookie('refreshToken', newRefreshToken, {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/',
      httpOnly: isProduction,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      accessToken,
      isPasswordChanged: user.isPasswordChanged,
    };
  }

  async refreshToken(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies?.refreshToken as string;
    if (!cookieRefreshToken) {
      throw new NotFoundException('Refresh token not found');
    }
    let decodedToken: {
      id: string;
      email: string;
      role: string;
    };

    try {
      decodedToken = await this.jwtService.verifyAsync<{
        id: string;
        email: string;
        role: string;
      }>(cookieRefreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error: unknown) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
    const hashedOldToken = hashToken(cookieRefreshToken);

    // Verify token exists in database and is not expired
    const existingToken = await this.userTokenDbService.findFirst({
      where: {
        token: hashedOldToken,
        type: TokenType.REFRESH,
        userId: decodedToken.id,
        expiresAt: { gt: new Date() },
      },
    });

    if (!existingToken) {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    const user = (await this.userDbService.findFirst({
      where: {
        id: decodedToken.id,
      },
      include: {
        role: true,
      },
    })) as User & { role: Role[] };

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userPermissions = (await this.roleDbService.findMany({
      where: {
        id: {
          in: user.role.map((role) => role.id),
        },
      },
      include: {
        permissions: true,
      },
    })) as (Role & { permissions: Permission[] })[];

    const permissionNames = [
      ...new Set(userPermissions.flatMap((role) => role.permissions.map((permission) => permission.name))),
    ];

    const roleName = [...new Set(userPermissions.flatMap((role) => (role.isSystemDefined ? [role.role] : [])))];

    const tokenPayload = {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: roleName[0],
      permissions: permissionNames,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as unknown as number,
    });

    const newRefreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as unknown as number,
    });
    const hashedNewToken = hashToken(newRefreshToken);
    await this.userTokenDbService.delete({
      where: {
        id: existingToken.id,
      },
    });

    await this.userTokenDbService.create({
      data: {
        userId: user.id,
        token: hashedNewToken,
        type: TokenType.REFRESH,
        expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';

    if (cookieRefreshToken) {
      res.clearCookie('refreshToken', {
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        httpOnly: isProduction,
        path: '/',
      });
    }

    res.cookie('refreshToken', newRefreshToken, {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      path: '/',
      httpOnly: isProduction,
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    return {
      message: 'Refresh token successful',
      accessToken,
    };
  }

  async logout(req: Request, res: Response) {
    const cookieRefreshToken = req.cookies?.refreshToken as string;
    const isProduction = process.env.NODE_ENV === 'production';
    if (!cookieRefreshToken) {
      res.clearCookie('refreshToken', {
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
        httpOnly: isProduction,
      });
      return {
        message: 'Logout successful',
      };
    }
    const token = await this.userTokenDbService.findFirst({
      where: {
        type: TokenType.REFRESH,
        token: hashToken(cookieRefreshToken),
        expiresAt: { gt: new Date() },
      },
    });
    if (!token) {
      res.clearCookie('refreshToken', {
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
        httpOnly: isProduction,
      });
      return {
        message: 'Logout successful',
      };
    }

    await this.userTokenDbService.delete({
      where: { id: token.id },
    });
    if (cookieRefreshToken) {
      res.clearCookie('refreshToken', {
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
        httpOnly: isProduction,
      });
    }
    return {
      message: 'User Logout successful',
    };
  }
}

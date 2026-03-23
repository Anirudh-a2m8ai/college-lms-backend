import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthStrategy } from './strategies/auth.strategy';
import { AuthController } from './auth.controller';
import { DbServiceModule } from 'src/repository/db-service.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET') || 'fallback_secret',
        signOptions: { expiresIn: '15m' },
      }),
    }),
    DbServiceModule,
  ],

  controllers: [AuthController],

  providers: [AuthService, AuthStrategy],

  exports: [JwtModule],
})
export class AuthModule {}

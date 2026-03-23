import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class ApiModule {}
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/common/guards/auth.guard';
import { RoleModule } from './role/role.module';
import { TenantModule } from './tenant/tenant.module';
import { DesignationModule } from './designation/designation.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [AuthModule, UserModule, RoleModule, TenantModule, DesignationModule, CourseModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class ApiModule {}

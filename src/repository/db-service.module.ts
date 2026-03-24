import { Module } from '@nestjs/common';
import { UserDbService } from './user.db-service';
import { UserTokenDbService } from './user-token.db-service';
import { RoleDbService } from './role.db-service';
import { TenantDbService } from './tenant.db-service';

@Module({
  providers: [UserDbService, UserTokenDbService, RoleDbService, TenantDbService],
  exports: [UserDbService, UserTokenDbService, RoleDbService, TenantDbService],
})
export class DbServiceModule {}

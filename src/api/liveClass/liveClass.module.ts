import { Module } from '@nestjs/common';
import { LiveClassController } from './liveClass.controller';
import { LiveClassService } from './liveClass.service';
import { DbServiceModule } from 'src/repository/db-service.module';
import { AuthModule } from '../auth/auth.module';
import { LiveClassGateway } from './gateway/liveClass.gateway';

@Module({
  imports: [DbServiceModule, AuthModule],
  controllers: [LiveClassController],
  providers: [LiveClassService, LiveClassGateway],
})
export class LiveClassModule {}

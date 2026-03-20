import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthStrategy } from "./strategies/auth.strategy";
import { DbServiceModule } from "src/repository/db-service.module";

@Module({
    imports: [
			PassportModule,
			JwtModule.register({
				secret: process.env.JWT_ACCESS_SECRET || 'fallback_secret',
				signOptions: { expiresIn: '15m' },
			}),
			DbServiceModule
    ],
    controllers: [AuthController],
    providers: [
			AuthService,
			AuthStrategy,
    ],
})
export class AuthModule {}
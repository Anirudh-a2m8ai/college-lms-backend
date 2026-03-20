import { Module } from "@nestjs/common";
import { UserDbService } from "./user.db-service";
import { UserTokenDbService } from "./user-token.db-service";

@Module({
	providers: [
		UserDbService,
		UserTokenDbService
	],
	exports: [
		UserDbService,
		UserTokenDbService
	],
})
export class DbServiceModule {}
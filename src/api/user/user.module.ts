import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DbServiceModule } from "src/repository/db-service.module";

@Module({
	imports: [DbServiceModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
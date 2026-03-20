import { Global, Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { BullModule } from '@nestjs/bullmq';
import { MailService } from "src/mail/mail.service";
import { EmailProcessor } from "./mail-processor";
import { UserProcessor } from "./user-processor";
import { UserService } from "src/api/user/user.service";
import { DbServiceModule } from "src/repository/db-service.module";

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
      name: 'mailQueue',
    }),
		BullModule.registerQueue({
      name: 'userQueue',
    }),
		DbServiceModule
	],
	providers: [
		UserService,
		QueueService,
		EmailProcessor,
		MailService,
		UserProcessor
	],
	exports: [
		QueueService
	]
})
export class QueueModule {}
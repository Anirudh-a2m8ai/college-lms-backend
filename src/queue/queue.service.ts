import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class QueueService {
	constructor(
		@InjectQueue('mailQueue') private mailQueue: Queue,
		@InjectQueue('userQueue') private userQueue: Queue,
	) {}

	async addSendOtpMailJob(payload: {to: string, otp: number}) {
    await this.mailQueue.add('sendOtpMail', payload, {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });
  }

	async addBulkUploadJob(filePath: string) {
    return await this.userQueue.add('bulkUpload', { filePath }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }
}
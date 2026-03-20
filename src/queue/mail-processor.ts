import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from 'src/mail/mail.service';

@Processor('mailQueue')
export class EmailProcessor extends WorkerHost {
	constructor(private readonly mailService: MailService) {
      super();
    }

	async process(job: Job) {
    if(job.name === 'sendOtpMail') {
		const { to, otp } = job.data;
		await this.mailService.sendOtpMail(to, otp);
	}
  }
}
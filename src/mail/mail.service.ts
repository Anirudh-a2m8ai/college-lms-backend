import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
	private transporter;
	constructor(private readonly configService: ConfigService) {
		this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.pass'),
      },
    });
	}

	async sendOtpMail(to: string, otp: number) {
		const html = this.renderTemplate('user-otp', { otp });
		await this.transporter.sendMail({
			from: this.configService.get<string>('mail.from'),
			to,
			subject: 'OTP for user',
			html,
		});
	}

	private renderTemplate(templateName: string, data: Record<string, any>): string {
    const templatePath = path.join(process.cwd(), 'src', 'templates', `${templateName}.hbs`);

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    return template(data);
  }
}
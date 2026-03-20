import { Body, Controller, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ForgotPasswordDto, SentUserOtpDto, SetUserPasswordDto } from "./dto/user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/utils/file-upload.util";
import { AccessTokenGuard } from "src/common/guards/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.userService.create(payload);
  }

	@Post("send-user-otp")
	async sendUserOtp(@Body() payload: SentUserOtpDto) {
		return await this.userService.sendUserOtp(payload);
	}

	@Post("verify-user-otp")
	async verifyUserOtp(@Body() payload: SentUserOtpDto) {
		return await this.userService.verifyUserOtp(payload);
	}

	@Post("set-password")
	async setPassword(@Body() payload: SetUserPasswordDto,@Query('token') token: string) {
		return await this.userService.setPassword(payload, token);
	}

	@UseGuards(AccessTokenGuard)
	@Post('bulk-upload')
	@UseInterceptors(FileInterceptor('file', multerOptions))
	async upload(@UploadedFile() file: Express.Multer.File) {
		return this.userService.handleBulkUpload(file);
	}
}
import { IsNotEmpty, IsString } from "class-validator";

export class SentUserOtpDto {
  @IsString()
	email: string;
}

export class SetUserPasswordDto {
	@IsNotEmpty()
	@IsString()
	password: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
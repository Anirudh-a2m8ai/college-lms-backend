import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SentUserOtpDto {
  @IsString()
	email: string;
}

export class VerifyUserOtpDto {
  @IsNotEmpty()
	@IsString()
	email: string;

  @IsNotEmpty()
	@IsNumber()
	otp: number;
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
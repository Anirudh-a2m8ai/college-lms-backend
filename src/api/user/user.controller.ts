import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SentUserOtpDto, SetUserPasswordDto, VerifyUserOtpDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/file-upload.util';
import { UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('user')
@UseGuards(PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions('user:create')
  @Post()
  async create(@Body() payload: CreateUserDto) {
    return await this.userService.create(payload);
  }

  @Public()
  @Post('send-otp')
  async sendUserOtp(@Body() payload: SentUserOtpDto) {
    return await this.userService.sendUserOtp(payload);
  }

  @Public()
  @Post('verify-otp')
  async verifyUserOtp(@Body() payload: VerifyUserOtpDto) {
    return await this.userService.verifyUserOtp(payload);
  }

  @Public()
  @Post('set-password')
  async setPassword(@Body() payload: SetUserPasswordDto, @Query('token') token: string) {
    console.log(token);
    return await this.userService.setPassword(payload, token);
  }

  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.userService.handleBulkUpload(file);
  }

  @Get('permissions')
  async getPermissions(@CurrentUser() user: any) {
    return this.userService.getPermissions(user.userId);
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}

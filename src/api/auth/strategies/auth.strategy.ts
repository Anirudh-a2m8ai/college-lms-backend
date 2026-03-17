import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.accessSecret') || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    // const user = await this.usersService.findById(payload.sub);
    // if (!user) throw new UnauthorizedException('User not found');
    // if (!user.isActive) throw new UnauthorizedException('User is inactive');
    return {};
  }
}
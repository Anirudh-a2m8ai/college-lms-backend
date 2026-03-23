import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: payload.id,
      email: payload.email,
    };
  }
}
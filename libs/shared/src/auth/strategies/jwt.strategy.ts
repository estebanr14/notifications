import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config, CONFIG } from '../../../../config/src';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(CONFIG) private readonly config: Config) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub || !payload.role) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      userId: payload.sub,
      role: payload.role,
      username: payload.username,
    };
  }
}

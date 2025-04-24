import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { JwtPayload } from '../domain/entities/auth.interface';
import { Config } from '@app/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly config: Config) {}

  async generateTokens(
    payload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const secret = this.config.jwtSecret;
    const refreshSecret = this.config.jwtRefreshSecret;
    if (!secret || !refreshSecret) {
      this.logger.error('jwt secrets not defined');
      throw new InternalServerErrorException('Error generatig token');
    }
    const accessToken = sign(payload, secret, {
      expiresIn: this.config.auth.jwtExpirationTime,
    });
    const refreshToken = sign({ ...payload, type: 'refresh' }, refreshSecret, {
      expiresIn: this.config.auth.jwtRefreshTime,
    });
    return { accessToken, refreshToken };
  }

  async validateRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const payload = verify(
        token,
        this.config.jwtRefreshSecret,
      ) as JwtPayload & { type: string };
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }
      return payload;
    } catch (e) {
      this.logger.error('Refresh token validation failed', e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

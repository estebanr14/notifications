import { ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { BaseRefreshTokenCommand } from '../commands/base-refresh-token.command';
import { AuthService } from '../auth.service';

export class BaseRefreshTokenHandler
  implements ICommandHandler<BaseRefreshTokenCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(
    command: BaseRefreshTokenCommand,
  ): Promise<{ refreshToken: string; accessToken; sub: string }> {
    const payload = await this.authService.validateRefreshToken(
      command.refreshToken,
    );

    if (!payload?.sub || !payload?.role) {
      throw new UnauthorizedException('Invalid payload in refresh token');
    }

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        sub: payload.sub,
        role: payload.role,
        username: payload.username,
      },
    );

    return { refreshToken, accessToken, sub: payload.sub };
  }
}

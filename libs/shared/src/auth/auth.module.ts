import { Module } from '@nestjs/common';
import authProviders from './application/providers/auth.providers';
import { BaseLoginHandler } from './application/handlers/base-login.handler';
import { AuthResponseUtil } from './utils/auth-response.util';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BaseRefreshTokenHandler } from './application/handlers/base-refresh-token.handler';
import { BaseChangePasswordHandler } from './application/handlers/base-change-password.handler';

const commandHandlers = [
  BaseLoginHandler,
  BaseRefreshTokenHandler,
  BaseChangePasswordHandler,
];
const queryHandlers = [];

@Module({
  imports: [],
  providers: [
    ...authProviders,
    ...commandHandlers,
    ...queryHandlers,
    AuthResponseUtil,
    RolesGuard,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [
    ...authProviders,
    AuthResponseUtil,
    RolesGuard,
    JwtAuthGuard,
    JwtStrategy,
  ],
  controllers: [],
})
export class AuthModule {}

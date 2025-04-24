import { ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmailValueObject } from '../../../types/email/value-objects/email.value-object';
import { IUserService } from '../user-service.interface';
import { BaseLoginCommand } from '../commands/base-login.command';
import { AuthService } from '../auth.service';

export class BaseLoginHandler implements ICommandHandler<BaseLoginCommand> {
  private readonly logger = new Logger(BaseLoginHandler.name);

  constructor(
    private readonly userService: IUserService,
    private readonly authService: AuthService,
  ) {}

  async execute(
    command: BaseLoginCommand,
  ): Promise<{ refreshToken: string; accessToken; sub: string }> {
    this.logger.log(
      `[BaseLoginHandler]: executing login for role ${command.role}`,
    );
    const emailHash = new EmailValueObject(command.email).toHashed();
    const user = await this.userService.findByEmailHash(emailHash);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      command.password,
      user.password.value,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        sub: user.id,
        role: command.role,
        username: user.username,
      },
    );

    return { refreshToken, accessToken, sub: user.id };
  }
}

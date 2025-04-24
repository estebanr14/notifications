import { ICommandHandler } from '@nestjs/cqrs';
import { BaseChangePasswordCommand } from '../commands/base-change-password.command';
import {
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserService } from '../user-service.interface';

export class BaseChangePasswordHandler
  implements ICommandHandler<BaseChangePasswordCommand>
{
  private readonly logger = new Logger(BaseChangePasswordHandler.name);

  constructor(private readonly service: IUserService) {}

  async execute(command: BaseChangePasswordCommand): Promise<void> {
    this.logger.log(
      `[BaseChangePasswordHandler]: Changing password for ${command.role} with ID ${command.userId}`,
    );

    const user = await this.service.findById(command.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatches = await bcrypt.compare(
      command.oldPassword,
      user.password.value,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid current password');
    }

    const newPasswordHash = await bcrypt.hash(command.newPassword, 10);

    try {
      await this.service.changePassword(command.userId, newPasswordHash);
      this.logger.log(
        `Password changed for ${command.role}: ${command.userId}`,
      );
    } catch (error) {
      this.logger.error(`Error changing password: ${error.message}`);
      throw new InternalServerErrorException('Error changing password');
    }
  }
}

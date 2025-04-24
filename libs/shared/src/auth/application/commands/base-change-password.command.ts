import { ICommand } from '@nestjs/cqrs';

export class BaseChangePasswordCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly oldPassword: string,
    public readonly newPassword: string,
    public readonly role: string,
  ) {}
}

import { ICommand } from '@nestjs/cqrs';

export class SendAdminsAlertCommand implements ICommand {
  constructor(
    public readonly alert: string,
    public readonly template: string,
    public readonly templateArgs: object,
    public readonly type: string,
    public readonly file?: Express.Multer.File,
  ) {}
}

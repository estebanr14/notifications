import { ICommand } from '@nestjs/cqrs';

export class SendMessageCommand implements ICommand {
  constructor(
    public readonly to: string,
    public readonly template: string,
    public readonly templateArgs: object,
    public readonly type: string,
    public readonly category: string,
    public readonly file?: Express.Multer.File,
    public readonly campaignId?: string,
  ) {}
}

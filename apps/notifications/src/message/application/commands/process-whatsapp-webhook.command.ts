import { ICommand } from '@nestjs/cqrs';

export class ProcessWhatsappWebhookCommand implements ICommand {
  constructor(public readonly payload: any) {}
}

import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ProcessWhatsappWebhookCommand } from '../commands/process-whatsapp-webhook.command';
import { Logger } from '@nestjs/common';
import { MessageService } from '../services/message.service';

@CommandHandler(ProcessWhatsappWebhookCommand)
export class ProcessWhatsappWebhookHandler
  implements ICommandHandler<ProcessWhatsappWebhookCommand>
{
  private readonly logger = new Logger(ProcessWhatsappWebhookHandler.name);
  constructor(private readonly messageService: MessageService) {}

  async execute(command: ProcessWhatsappWebhookCommand): Promise<void> {
    this.logger.log(
      `ProcessWhatsappWebhookHandler: ${JSON.stringify(command)}`,
    );
    const webhookMessage =
      command.payload.entry?.[0].changes?.[0].value?.messages?.[0];
    const webhookStatus =
      command.payload.entry?.[0].changes?.[0].value?.statuses?.[0];
    if (webhookMessage) {
      await this.messageService.sendAutomaticResponse(
        webhookMessage,
        command.payload,
      );
    } else if (webhookStatus) {
      await this.messageService.processWhatsAppIncomingStatus(
        command.payload,
        webhookStatus.status,
        webhookStatus.id,
      );
    }
  }
}

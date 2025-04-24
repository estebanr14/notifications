import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { SendMessageCommand } from '../commands/send-message.command';
import { MessageMapper } from '../mappers/message.mapper';
import { MessageStatusEnum } from '../../domain/value-objects/message-status.value-object';
import { Message } from '../../domain/entities/message.entity';

@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  private readonly logger = new Logger(SendMessageHandler.name);

  constructor(private readonly messageService: MessageService) {}

  async execute(command: SendMessageCommand): Promise<any> {
    this.logger.log(`[handler]: Processing send message`);
    if (command.campaignId) {
      const message = await this.messageService.findByCampaignId(
        command.campaignId,
        command.to,
      );
      if (message) {
        return null;
      }
    }

    const messageEntity = new Message({
      ...command,
      sentAt: new Date(),
      status: MessageStatusEnum.DRAFT,
    });
    const createdEntity = await this.messageService.create(messageEntity);
    const sentEntity = await this.messageService.sendMessage(
      createdEntity,
      command.file,
    );
    return MessageMapper.toResponse(sentEntity);
  }
}

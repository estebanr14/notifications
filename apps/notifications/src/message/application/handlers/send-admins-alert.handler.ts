import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendAdminsAlertCommand } from '../commands/send-admins-alert.command';
import { MessageService } from '../services/message.service';
import { Message } from '../../domain/entities/message.entity';
import { MessageCategoryEnum } from '../../../../../../libs/shared/src/types/notifications/message-category.value-object';
import { MessageStatusEnum } from '../../domain/value-objects/message-status.value-object';

@CommandHandler(SendAdminsAlertCommand)
export class SendAdminsAlertHandler
  implements ICommandHandler<SendAdminsAlertCommand>
{
  constructor(private readonly messageService: MessageService) {}

  async execute(command: SendAdminsAlertCommand): Promise<void> {
    const { alert, template, templateArgs, type, file } = command;
    const messageEntity = new Message({
      template,
      templateArgs,
      type,
      status: MessageStatusEnum.DRAFT,
      category: MessageCategoryEnum.ALERT,
    });
    await this.messageService.sendAdminsAlert(messageEntity, alert, file);
  }
}

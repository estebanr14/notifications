import { Inject, Injectable, Logger } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { CONFIG, Config } from '@app/config';
import * as SendGrid from '@sendgrid/mail';
import { IMessageSender } from '../../../domain/interfaces/message-sender';
import { defaultEmailTemplate, mfaEmailTemplate } from '../templates';
import { Message } from '../../../domain/entities/message.entity';
import {
  MessageTemplate,
  MessageTemplateEnum,
} from '../../../../../../../libs/shared/src/types/notifications/message-template.value-object';

@Injectable()
export class SendgridEmailSender implements IMessageSender {
  public readonly platform: string = 'SENDGRID';
  public readonly fromValue: string;
  private readonly logger = new Logger(SendgridEmailSender.name);

  constructor(@Inject(CONFIG) private readonly config: Config) {
    SendGrid.setApiKey(this.config.sendgridApiKey);
    this.fromValue = this.config.emailFrom;
  }

  private buildTemplate(templateName: string, templateArgs: object): string {
    switch (templateName) {
      case MessageTemplateEnum.MFA:
        return mfaEmailTemplate(templateArgs);
      default:
        return defaultEmailTemplate(templateArgs);
    }
  }

  async sendMessage(
    message: Message,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      const template = this.buildTemplate(
        message.template.value,
        message.templateArgs,
      );
      const mail: MailDataRequired = {
        to: message.to,
        from: message.from,
        subject: MessageTemplate.getSubject(message.template.value),
        html: template,
      };
      if (file) {
        mail.attachments = [
          {
            content: file.buffer.toString('base64'),
            filename: file.originalname,
          },
        ];
      }
      await SendGrid.send(mail);
      this.logger.log(`E-Mail with subject ${mail.subject} sent to ${mail.to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendMessageMock(
    message: Message,
    file?: Express.Multer.File,
  ): Promise<{ success: boolean; error?: string }> {
    this.logger.log(
      `[service]: Sending Email Mock: ${JSON.stringify(message)}`,
    );
    if (file) {
      this.logger.log(
        `[service]: Sending Email Mock with file: ${JSON.stringify(
          file.originalname,
        )}`,
      );
    }
    return { success: true };
  }
}

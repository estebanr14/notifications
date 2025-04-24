import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONFIG } from '@app/config';
import { Config } from '@app/config';
import { Twilio } from 'twilio';
import { IMessageSender } from '../../../domain/interfaces/message-sender';
import { Message } from '../../../domain/entities/message.entity';
import { defaultSms, shippingNotificationSms } from '../templates';
import { MessageTemplateEnum } from '../../../../../../../libs/shared/src/types/notifications/message-template.value-object';

@Injectable()
export class TwilioSmsSenderService implements IMessageSender {
  private readonly twilioClient: Twilio;
  private readonly logger = new Logger(TwilioSmsSenderService.name);
  public readonly platform = 'TWILIO';
  public readonly fromValue: string;

  constructor(@Inject(CONFIG) private readonly config: Config) {
    this.twilioClient = new Twilio(
      this.config.twilio.accountSid,
      this.config.twilio.authToken,
    );
    this.fromValue = this.config.twilio.fromNumber;
  }

  public buildMessage(templateName: string, templateArgs: object): string {
    switch (templateName) {
      case MessageTemplateEnum.SHIPPING_NOTIFICATION:
        return shippingNotificationSms(templateArgs);
      default:
        return defaultSms(templateArgs);
    }
  }

  async sendMessage(
    message: Message,
  ): Promise<{ success: boolean; error?: string }> {
    const messageBody = this.buildMessage(
      message.template.value,
      message.templateArgs,
    );
    try {
      await this.twilioClient.messages.create({
        to: message.to,
        body: messageBody,
        from: this.fromValue,
      });
      this.logger.log('SMS sent successfully');
      return { success: true };
    } catch (error) {
      this.logger.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }

  async sendMessageMock(
    message: Message,
  ): Promise<{ success: boolean; error?: string }> {
    this.logger.log(`[service]: Sending SMS Mock: ${JSON.stringify(message)}`);
    return { success: true };
  }
}

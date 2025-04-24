import { Inject, Injectable, Logger } from '@nestjs/common';
import { IMessageSender } from '../../../domain/interfaces/message-sender';
import { Config, CONFIG } from '@app/config';
import { HttpClientService } from '@app/shared';
import { Message } from '../../../domain/entities/message.entity';
import { MessageTemplateEnum } from '../../../../../../../libs/shared/src/types/notifications/message-template.value-object';
import {
  automaticResponseTemplate,
  offer1Template,
  shipmentCompletedAdminsTemplate,
  shipmentCompletedClientsTemplate,
  sundayOfferTemplate,
  trackingLinkTemplate,
  trackingLinkWithoutNameTemplate,
  womensDayTemplate,
} from '../templates';

@Injectable()
export class MetaSenderService implements IMessageSender {
  public readonly platform: string = 'META';
  public fromValue: string;
  private apiUrl: string;
  private phoneNumberId: string;
  private accessToken: string;
  public phoneNumber: string;
  private readonly logger = new Logger(MetaSenderService.name);

  constructor(
    private readonly httpClient: HttpClientService,
    @Inject(CONFIG) private readonly config: Config,
  ) {
    this.setupMeta();
  }

  private setupMeta() {
    this.apiUrl = this.config.whatsapp.apiUrl;
    this.phoneNumberId = this.config.whatsapp.phoneNumberId;
    this.accessToken = this.config.whatsapp.accessToken;
    this.phoneNumber = this.config.whatsapp.phoneNumber;
    this.fromValue = this.config.whatsapp.phoneNumber;
  }

  private buildTemplate(message: Message): { template?: object; text?: any } {
    switch (message.template.value) {
      case MessageTemplateEnum.TRACKING_LINK:
        return { template: trackingLinkTemplate(message.templateArgs) };
      case MessageTemplateEnum.TRACKING_LINK_WITHOUT_NAME:
        return {
          template: trackingLinkWithoutNameTemplate(message.templateArgs),
        };
      case MessageTemplateEnum.SHIPMENT_COMPLETED_ADMINS:
        return {
          template: shipmentCompletedAdminsTemplate(message.templateArgs),
        };
      case MessageTemplateEnum.SHIPMENT_COMPLETED_CLIENT:
        return { template: shipmentCompletedClientsTemplate() };
      case MessageTemplateEnum.AUTOMATIC_RESPONSE:
        return { text: automaticResponseTemplate() };
      case MessageTemplateEnum.WOMENS_DAY:
        return { template: womensDayTemplate(message.templateArgs) };
      case MessageTemplateEnum.SUNDAY_OFFER:
        return { template: sundayOfferTemplate() };
      case MessageTemplateEnum.OFFER_1:
        return { template: offer1Template() };
      default:
        throw new Error('Invalid template');
    }
  }

  private buildWhatsappRequest(message: Message) {
    const { template, text } = this.buildTemplate(message);
    const request: any = {
      url: `${this.apiUrl}/${this.phoneNumberId}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: {
        messaging_product: 'whatsapp',
        to: message.to,
      },
    };
    if (template) {
      request.body.type = 'template';
      request.body.template = template;
    } else if (text) {
      request.body.text = { body: text };
    }
    return request;
  }

  async sendMessage(
    message: Message,
  ): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      this.logger.log(
        `[service]: Sending WhatsApp: ${JSON.stringify(message)}`,
      );
      const request = this.buildWhatsappRequest(message);
      const response = await this.httpClient.post(request);
      this.logger.log(`[service]: Response: ${JSON.stringify(response)}`);
      if (response.error) {
        return this.createErrorResponse(response.message);
      }
      return { success: true, id: response.body?.messages[0].id };
    } catch (error) {
      this.logger.error(`[service]: Error sending WhatsApp: ${error}`);
      return this.createErrorResponse(error.message);
    }
  }

  async sendMessageMock(
    message: Message,
  ): Promise<{ success: boolean; error?: string }> {
    this.logger.log(
      `[service]: Sending WhatsApp Mock: ${JSON.stringify(message)}`,
    );
    return { success: true };
  }

  private createErrorResponse(message?: string): {
    success: boolean;
    error?: string;
  } {
    return {
      success: false,
      error: message || 'Unexpected error sending WhatsApp',
    };
  }
}

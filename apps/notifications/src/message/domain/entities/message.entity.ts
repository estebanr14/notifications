import { IMessage } from '../interfaces/message.interface';
import { MessageType } from '../../../../../../libs/shared/src/types/notifications/message-type.value-object';
import { MessageCategory } from '../../../../../../libs/shared/src/types/notifications/message-category.value-object';
import { MessageStatus } from '../value-objects/message-status.value-object';
import { MessageTemplate } from '../../../../../../libs/shared/src/types/notifications/message-template.value-object';

export class Message {
  public id: string;
  public from?: string;
  public to?: string;
  public template: MessageTemplate;
  public templateArgs: object;
  public sentAt?: Date;
  public status: MessageStatus;
  public error?: string;
  public platform?: string;
  public type: MessageType;
  public category?: MessageCategory;
  public createdAt?: Date;
  public updatedAt?: Date;
  public providerId?: string;
  public webhooksData?: any[];
  public campaignId?: string;

  constructor(props: IMessage) {
    this.id = props.id;
    this.from = props.from;
    this.to = props.to;
    this.template = new MessageTemplate(props.template);
    this.templateArgs = props.templateArgs;
    this.sentAt = props.sentAt;
    this.status = new MessageStatus(props.status);
    this.error = props.error;
    this.platform = props.platform;
    this.type = new MessageType(props.type);
    this.category = new MessageCategory(props.category);
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.providerId = props.providerId;
    this.webhooksData = props.webhooksData;
    this.campaignId = props.campaignId;
  }

  public static fromDatabase(document: IMessage): Message {
    return new Message(document);
  }

  public toDatabase(): IMessage {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      template: this.template.value,
      templateArgs: this.templateArgs,
      sentAt: this.sentAt,
      status: this.status.value,
      error: this.error,
      platform: this.platform,
      type: this.type.value,
      category: this.category.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      providerId: this.providerId,
      webhooksData: this.webhooksData,
      campaignId: this.campaignId,
    };
  }

  public toPrimitives(): IMessage {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      template: this.template.value,
      templateArgs: this.templateArgs,
      sentAt: this.sentAt,
      status: this.status.value,
      error: this.error,
      platform: this.platform,
      type: this.type.value,
      category: this.category.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      providerId: this.providerId,
      webhooksData: this.webhooksData,
      campaignId: this.campaignId,
    };
  }
}

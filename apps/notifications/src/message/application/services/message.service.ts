import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { Message } from '../../domain/entities/message.entity';
import { PaginatedParams, PaginatedResult } from '@app/database';
import { IMessageSender } from '../../domain/interfaces/message-sender';
import { MessageMongoRepository } from '../../infraestructure/persistance/mongodb/message.mongo.repository';
import {
  MessageType,
  MessageTypeEnum,
} from '../../../../../../libs/shared/src/types/notifications/message-type.value-object';
import {
  MessageStatus,
  MessageStatusEnum,
} from '../../domain/value-objects/message-status.value-object';
import {
  AdminMQContract,
  IGetAdminsByAlertMQPayload,
  MessageFactory,
  MQExchangeEnum,
  RmqSenderService,
} from '@app/rabbit-mq';
import { MessageCategoryEnum } from '../../../../../../libs/shared/src/types/notifications/message-category.value-object';
import { MessageTemplateEnum } from '../../../../../../libs/shared/src/types/notifications/message-template.value-object';
import { Config, CONFIG } from '@app/config';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly repository: MessageMongoRepository,
    private readonly smsService: IMessageSender,
    private readonly emailService: IMessageSender,
    private readonly whatsappService: IMessageSender,
    private readonly rmqSenderService: RmqSenderService,
    @Inject(CONFIG) private readonly config: Config,
  ) {}

  async create(payload: Message): Promise<Message> {
    const created = await this.repository.create(payload.toDatabase());
    return Message.fromDatabase(created);
  }

  async findAll(params: PaginatedParams): Promise<PaginatedResult<Message>> {
    const paginatedResult = await this.repository.paginatedSearch(params);

    return {
      ...paginatedResult,
      results: paginatedResult.results.map((doc) => Message.fromDatabase(doc)),
    };
  }

  async findById(id: string): Promise<Message> {
    const document = await this.repository.findById(id);
    if (!document)
      throw new NotFoundException(`Message with ID ${id} not
                    found`);
    return Message.fromDatabase(document);
  }

  async findByCampaignId(campaignId: string, phone: string): Promise<Message> {
    const document = await this.repository.findOne({
      campaignId,
      to: phone,
      status: { $ne: MessageStatusEnum.FAILED },
    });
    return document ? Message.fromDatabase(document) : null;
  }

  async update(message: Message): Promise<Message> {
    const updated = await this.repository.update(
      { id: message.id },
      message.toDatabase(),
    );
    return Message.fromDatabase(updated);
  }

  private getMessageSender(messageType: MessageType): IMessageSender {
    switch (messageType.value) {
      case MessageTypeEnum.EMAIL:
        return this.emailService;
      case MessageTypeEnum.WHATSAPP:
        return this.whatsappService;
      case MessageTypeEnum.SMS:
        return this.smsService;
      default:
        throw new Error('Invalid message type');
    }
  }

  async sendMessage(
    message: Message,
    file?: Express.Multer.File,
  ): Promise<Message> {
    const sender = this.getMessageSender(message.type);
    message.platform = sender.platform;
    message.from = sender.fromValue;
    message.status = new MessageStatus(MessageStatusEnum.IN_PROGRESS);
    await this.update(message);
    const result = this.config.notificationsMock
      ? await sender.sendMessageMock(message, file)
      : await sender.sendMessage(message, file);
    if (result.success) {
      if (message.type.value !== MessageTypeEnum.WHATSAPP) {
        message.status = new MessageStatus(MessageStatusEnum.SENT);
      }
      message.providerId = result.id;
    } else {
      message.status = new MessageStatus(MessageStatusEnum.FAILED);
      message.error = result.error;
    }
    await this.update(message);
    return message;
  }

  async sendAdminsAlert(
    messageEntity: Message,
    alert: string,
    file?: Express.Multer.File,
  ): Promise<void> {
    // Get admins
    const mqMessage = MessageFactory.createQuery<IGetAdminsByAlertMQPayload>(
      MQExchangeEnum.BACKOFFICE,
      AdminMQContract.Routes.Query.GetAdminsByAlert,
      { alert },
    );
    const queryAdminsResult = await this.rmqSenderService.sendToQueue<
      IGetAdminsByAlertMQPayload,
      { admins: any }
    >(mqMessage);
    if (!queryAdminsResult.success) {
      throw new Error('Error getting admins');
    }
    // Send message to admins
    for (const admin of queryAdminsResult.data.admins) {
      messageEntity.to = MessageType.typesByPhoneNumber(messageEntity.type)
        ? admin.phoneNumber
        : admin.email;
      messageEntity.sentAt = new Date();
      const message = await this.create(messageEntity);
      await this.sendMessage(message, file);
    }
  }

  async sendAutomaticResponse(
    webhookMessage: any,
    webhookMetadata: any,
  ): Promise<void> {
    const messageEntity = new Message({
      type: MessageTypeEnum.WHATSAPP,
      category: MessageCategoryEnum.SUPPORT,
      status: MessageStatusEnum.DRAFT,
      sentAt: new Date(),
      templateArgs: {},
      template: MessageTemplateEnum.AUTOMATIC_RESPONSE,
      to: webhookMessage.from,
      webhooksData: [webhookMetadata],
    });
    const createdEntity = await this.create(messageEntity);
    await this.sendMessage(createdEntity);
  }

  async processWhatsAppIncomingStatus(
    metadata: any,
    webhookStatus: any,
    providerId: string,
  ): Promise<void> {
    const message = await this.repository.findOne({ providerId });
    if (!message) {
      this.logger.error(`Message with ID ${webhookStatus.id} not found`);
      return;
    }
    const messageEntity = new Message(message);
    messageEntity.webhooksData.push(metadata);
    if (webhookStatus === 'delivered') {
      messageEntity.status = new MessageStatus(MessageStatusEnum.SENT);
    }
    await this.update(messageEntity);
  }
}

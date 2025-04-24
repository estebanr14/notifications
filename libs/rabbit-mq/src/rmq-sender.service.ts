import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Message, MessageResponse } from '@app/rabbit-mq';
import { MQExchangeEnum } from './contracts/base.contract';

@Injectable()
export class RmqSenderService {
  private readonly logger = new Logger(RmqSenderService.name);

  constructor(
    private readonly backendQueue: ClientProxy,
    private readonly backOfficeQueue: ClientProxy,
    private readonly notificationsQueue: ClientProxy,
  ) {}

  async sendToQueue<TPayload, TResponse>(
    message: Message<TPayload>,
  ): Promise<MessageResponse<TResponse>> {
    try {
      this.logger.debug(`processing message: ${message.routingKey}`);
      let client: ClientProxy;
      switch (message.exchange) {
        case MQExchangeEnum.BACKOFFICE:
          client = this.backOfficeQueue;
          break;
        case MQExchangeEnum.NOTIFICATIONS:
          client = this.notificationsQueue;
          break;
        default:
          client = this.backendQueue;
      }
      if (message.needsReply) {
        const response = await lastValueFrom(
          client.send<MessageResponse<TResponse>>(message.routingKey, message),
        );
        this.logger.debug(
          `Response received for message: ${message.routingKey}`,
        );
        return response;
      } else {
        client.emit(message.routingKey, message);
        this.logger.debug(`Message emitted to queue: ${message.routingKey}`);
        return { success: true, data: null };
      }
    } catch (error) {
      this.logger.error(
        `Error sending message ${message.routingKey}: ${error}`,
      );
      return {
        success: false,
        error: {
          code: 'MQ_ERROR',
          message: error.message,
          details: error,
        },
      };
    }
  }
}

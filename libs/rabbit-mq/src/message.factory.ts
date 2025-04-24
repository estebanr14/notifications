import { MQExchangeEnum, Message } from './contracts/base.contract';

export class MessageFactory {
  static createCommand<T>(
    exchange: MQExchangeEnum,
    routingKey: string,
    payload: T,
    needsReply = false,
  ): Message<T> {
    return {
      type: 'COMMAND',
      exchange,
      routingKey,
      payload,
      needsReply,
    };
  }

  static createQuery<T>(
    exchange: MQExchangeEnum,
    routingKey: string,
    payload: T,
  ): Message<T> {
    return {
      type: 'QUERY',
      exchange,
      routingKey,
      payload,
      needsReply: true,
    };
  }

  static createEvent<T>(
    exchange: MQExchangeEnum,
    routingKey: string,
    payload: T,
  ): Message<T> {
    return {
      type: 'EVENT',
      exchange,
      routingKey,
      payload,
      needsReply: false,
    };
  }
}

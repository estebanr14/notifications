export enum MQExchangeEnum {
  BACKOFFICE = 'backoffice-exchange',
  BACKEND = 'backend-exchange',
  NOTIFICATIONS = 'notifications-exchange',
}

export type CommandMessage<T = unknown> = {
  type: 'COMMAND';
  exchange: MQExchangeEnum;
  routingKey: string;
  payload: T;
  needsReply: boolean;
};

export type QueryMessage<T = unknown> = {
  type: 'QUERY';
  exchange: MQExchangeEnum;
  routingKey: string;
  payload: T;
  needsReply: true;
};

export type EventMessage<T = unknown> = {
  type: 'EVENT';
  exchange: MQExchangeEnum;
  routingKey: string;
  payload: T;
  needsReply: false;
};

export type Message<T = unknown> =
  | CommandMessage<T>
  | QueryMessage<T>
  | EventMessage<T>;

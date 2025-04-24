import { Module, Global } from '@nestjs/common';
import { RabbitMQConfig } from './rabbit-mq.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Config, CONFIG } from '../../config/src';
import { RmqRetryHandler } from './rabbit-mq-retry-handler.service';

export const BACKEND_QUEUE_CLIENT = Symbol('BACKEND_QUEUE_CLIENT');
export const BACKOFFICE_QUEUE_CLIENT = Symbol('BACKOFFICE_QUEUE_CLIENT');
export const NOTIFICATIONS_QUEUE_CLIENT = Symbol('NOTIFICATIONS_QUEUE_CLIENT');

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: BACKEND_QUEUE_CLIENT,
        inject: [CONFIG],
        useFactory: (config: Config) => {
          const { connectionString } = config.rabbit;
          const { queue, exchange, routingKey, dlx, dlxRoutingKey } =
            config.rabbit.backend;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [connectionString],
              queue: queue,
              exchange: exchange,
              routingKey: routingKey,
              queueOptions: {
                durable: true,
                deadLetterExchange: dlx,
                deadLetterRoutingKey: dlxRoutingKey,
              },
            },
          };
        },
      },
      {
        name: BACKOFFICE_QUEUE_CLIENT,
        inject: [CONFIG],
        useFactory: (config: Config) => {
          const { connectionString } = config.rabbit;
          const { queue, exchange, routingKey, dlx, dlxRoutingKey } =
            config.rabbit.backoffice;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [connectionString],
              queue: queue,
              exchange: exchange,
              routingKey: routingKey,
              queueOptions: {
                durable: true,
                deadLetterExchange: dlx,
                deadLetterRoutingKey: dlxRoutingKey,
                noAck: false,
              },
            },
          };
        },
      },
      {
        name: NOTIFICATIONS_QUEUE_CLIENT,
        inject: [CONFIG],
        useFactory: (config: Config) => {
          const { connectionString } = config.rabbit;
          const { queue, exchange, routingKey, dlx, dlxRoutingKey } =
            config.rabbit.notifications;
          return {
            transport: Transport.RMQ,
            options: {
              urls: [connectionString],
              queue: queue,
              exchange: exchange,
              routingKey: routingKey,
              queueOptions: {
                durable: true,
                deadLetterExchange: dlx,
                deadLetterRoutingKey: dlxRoutingKey,
                noAck: false,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [RabbitMQConfig, RmqRetryHandler],
  exports: [RabbitMQConfig, ClientsModule, RmqRetryHandler],
})
export class RabbitMqModule {}

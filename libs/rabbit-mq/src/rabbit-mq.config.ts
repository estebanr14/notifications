import {
  Injectable,
  OnApplicationBootstrap,
  Logger,
  Inject,
} from '@nestjs/common';
import * as amqp from 'amqplib';
import { CONFIG, Config } from '@app/config';

@Injectable()
export class RabbitMQConfig implements OnApplicationBootstrap {
  private logger = new Logger(RabbitMQConfig.name);
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  async onApplicationBootstrap() {
    const appName = this.config.appName;
    const { connectionString } = this.config.rabbit;
    const {
      exchange,
      queue,
      routingKey,
      dlxRoutingKey,
      dlx,
      dlxQueue,
      failedQueue,
      failedRoutingKey,
    } = this.config.rabbit[appName];

    const connection = await amqp.connect(connectionString);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertExchange(dlx, 'topic', { durable: true });

    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlx,
        'x-dead-letter-routing-key': dlxRoutingKey,
      },
    });
    await channel.bindQueue(queue, exchange, routingKey);

    await channel.assertQueue(dlxQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': exchange,
        'x-message-ttl': 5000,
        'x-dead-letter-routing-key': routingKey,
      },
    });
    await channel.bindQueue(dlxQueue, dlx, dlxRoutingKey);

    await channel.assertQueue(failedQueue, { durable: true });
    await channel.bindQueue(failedQueue, dlx, failedRoutingKey);

    this.logger.log('RabbitMQ exchanges and queues configured.');

    //await channel.close();
    //await connection.close();
  }
}

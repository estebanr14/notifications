import { Inject, Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Config, CONFIG } from '@app/config';

@Injectable()
export class RmqRetryHandler {
  private readonly logger = new Logger(RmqRetryHandler.name);
  constructor(@Inject(CONFIG) private readonly config: Config) {}

  async handle(
    context: RmqContext,
    processFn: () => Promise<any>,
  ): Promise<any> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const messageName = context.getPattern();
    const headers = originalMsg.properties.headers;
    const xDeath = (headers['x-death'] as Array<any>) || [];
    const deathCount = xDeath[0]?.count || 0;

    try {
      const result = await processFn();
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      this.logger.error(
        `Error processing message ${messageName}. Attempt #${deathCount}: ${error.message}`,
      );

      if (deathCount >= 3) {
        this.logger.error(
          `Retry limit exceeded. Sending message ${messageName} to failed queue.`,
        );
        const appName = this.config.appName;
        const { dlx, failedRoutingKey } = this.config.rabbit[appName];
        channel.publish(dlx, failedRoutingKey, originalMsg.content, {
          headers: headers,
          persistent: true,
        });
        channel.ack(originalMsg);
      } else {
        channel.nack(originalMsg, false, false);
      }
    }
  }
}

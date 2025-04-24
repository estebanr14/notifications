import { Controller, Logger } from '@nestjs/common';
import {
  Payload,
  Ctx,
  RmqContext,
  MessagePattern,
  EventPattern,
} from '@nestjs/microservices';
import {
  MessageMQContract,
  ISendMessageMQPayload,
  Message,
  RmqRetryHandler,
  ISendAdminsAlertMQPayload,
} from '@app/rabbit-mq';
import { NestCqrsCaller } from '@app/shared';
import { SendMessageCommand } from '../../application/commands/send-message.command';
import { SendAdminsAlertCommand } from '../../application/commands/send-admins-alert.command';

@Controller()
export class MessageMqController {
  private logger = new Logger(MessageMqController.name);

  constructor(
    private readonly cqrsCaller: NestCqrsCaller,
    private readonly rmqRetryHandler: RmqRetryHandler,
  ) {}

  @MessagePattern(MessageMQContract.Routes.Commands.SendMessage)
  async handleSendMessage(
    @Payload() data: Message<ISendMessageMQPayload>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const controllerFunction = async () => {
        this.logger.log(`Received event: ${data.routingKey}`);
        const { file, template, templateArgs, to, type, category, campaignId } =
          data.payload;
        if (file) {
          file.buffer = Buffer.from(file.buffer);
        }
        const command = new SendMessageCommand(
          to,
          template,
          templateArgs,
          type,
          category,
          file,
          campaignId,
        );
        return await this.cqrsCaller.dispatch(command, false);
      };

      const result: any = await this.rmqRetryHandler.handle(
        context,
        controllerFunction,
      );

      return {
        success: result ? true : false,
        data: { message: result },
      };
    } catch (error) {
      this.logger.error(`Error sending message: ${error}`);
      context.getChannelRef().ack(context.getMessage());
      return {
        success: false,
        error: { code: 'MQ_ERROR', message: error.message, details: error },
      };
    }
  }

  @EventPattern(MessageMQContract.Routes.Events.SendAdminsAlert)
  async handleSendAdminsAlert(
    @Payload() data: Message<ISendAdminsAlertMQPayload>,
    @Ctx() context: RmqContext,
  ) {
    try {
      const controllerFunction = async () => {
        this.logger.log(`Received event: ${data.routingKey}`);
        const { alert, template, templateArgs, type, file } = data.payload;
        const command = new SendAdminsAlertCommand(
          alert,
          template,
          templateArgs,
          type,
          file,
        );
        return await this.cqrsCaller.dispatch(command, false);
      };
      await this.rmqRetryHandler.handle(context, controllerFunction);
    } catch (error) {
      this.logger.error(`Error sending admins alert: ${error}`);
      context.getChannelRef().ack(context.getMessage());
    }
  }
}

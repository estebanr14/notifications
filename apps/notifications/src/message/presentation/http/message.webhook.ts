import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Body,
  Logger,
} from '@nestjs/common';
import { NestCqrsCaller } from '@app/shared/cqrs/nest-cqrs-caller.service';
import { ApiTags } from '@nestjs/swagger';
import { Config, CONFIG } from '@app/config';
import { ProcessWhatsappWebhookCommand } from '../../application/commands/process-whatsapp-webhook.command';
@ApiTags('webhook')
@Controller('messages/webhook')
export class MessageWebhookController {
  private readonly logger = new Logger(MessageWebhookController.name);
  constructor(
    private readonly cqrsCaller: NestCqrsCaller,
    @Inject(CONFIG) private readonly config: Config,
  ) {}

  @Get('meta')
  async handleSubscription(@Query() query: any): Promise<any> {
    this.logger.log(`handleSubscription: ${JSON.stringify(query, null, 2)}`);
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    this.logger.log(`mode: ${mode}, token: ${token}, challenge: ${challenge}`);
    if (
      mode === 'subscribe' &&
      token === this.config.whatsapp.webhookVerifyToken
    ) {
      this.logger.log(`Webhook verified successfully!`);
      return challenge;
    } else {
      this.logger.error(`Webhook verification failed!`);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Post('meta')
  async handleWebhook(@Body() body: any): Promise<any> {
    const command = new ProcessWhatsappWebhookCommand(body);
    await this.cqrsCaller.dispatch(command);
    return;
  }
}

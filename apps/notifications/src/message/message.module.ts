import { Module } from '@nestjs/common';
import messageProviders from './application/services/message.providers';
import { MessageController } from './presentation/http/message.controller';
import { SendMessageHandler } from './application/handlers/send-message.handler';
import { GetMessageHandler } from './application/handlers/get-message.handler';
import { GetListMessageHandler } from './application/handlers/get-list-message.handler';
import messageMongoProvider from './infraestructure/persistance/mongodb/message.mongo.provider';
import TwilioServiceProvider from './infraestructure/sms/twilio/twilio.provider';
import SendgridServiceProvider from './infraestructure/email/sendgrid/sendgrid.provider';
import MetaServiceProvider from './infraestructure/whatsapp/meta/meta-sender.providers';
import { MessageMqController } from './presentation/mq/message.mq.controller';
import { SendAdminsAlertHandler } from './application/handlers/send-admins-alert.handler';
import { MessageWebhookController } from './presentation/http/message.webhook';
import { ProcessWhatsappWebhookHandler } from './application/handlers/process-whatsapp-webhook.handler';

const commandHandlers = [
  SendMessageHandler,
  SendAdminsAlertHandler,
  ProcessWhatsappWebhookHandler,
];
const queryHandlers = [GetMessageHandler, GetListMessageHandler];

@Module({
  providers: [
    ...messageProviders,
    ...commandHandlers,
    ...queryHandlers,
    ...messageMongoProvider,
    ...messageProviders,
    ...commandHandlers,
    ...queryHandlers,
    TwilioServiceProvider,
    SendgridServiceProvider,
    MetaServiceProvider,
  ],
  exports: [...messageProviders],
  controllers: [
    MessageController,
    MessageMqController,
    MessageWebhookController,
  ],
})
export class MessageModule {}

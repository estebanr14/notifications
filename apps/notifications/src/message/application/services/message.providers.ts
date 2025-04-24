import { MongoConstantsProvider } from '@app/database/mongo/mongo.constants';
import { Provider } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageMongoRepository } from '../../infraestructure/persistance/mongodb/message.mongo.repository';
import { SENDGRID_EMAIL_PROVIDER } from '../../infraestructure/email/sendgrid/sendgrid.provider';
import { SendgridEmailSender } from '../../infraestructure/email/sendgrid/sendgrid.service';
import { TWILIO_PROVIDER } from '../../infraestructure/sms/twilio/twilio.provider';
import { TwilioSmsSenderService } from '../../infraestructure/sms/twilio/twilio.service';
import { META_PROVIDER } from '../../infraestructure/whatsapp/meta/meta-sender.providers';
import { MetaSenderService } from '../../infraestructure/whatsapp/meta/meta-sender.service';
import { RmqSenderService } from '@app/rabbit-mq';
import { Config, CONFIG } from '@app/config';

const MessageServiceProvider = {
  provide: MessageService,
  useFactory: (
    repository: MessageMongoRepository,
    twilioService: TwilioSmsSenderService,
    sendgridEmailSender: SendgridEmailSender,
    metaSenderService: MetaSenderService,
    rmqSenderService: RmqSenderService,
    config: Config,
  ) =>
    new MessageService(
      repository,
      twilioService,
      sendgridEmailSender,
      metaSenderService,
      rmqSenderService,
      config,
    ),
  inject: [
    MongoConstantsProvider.MongoMessageRepository,
    TWILIO_PROVIDER,
    SENDGRID_EMAIL_PROVIDER,
    META_PROVIDER,
    RmqSenderService,
    CONFIG,
  ],
};

const MessageProviders: Provider[] = [MessageServiceProvider];

export default MessageProviders;

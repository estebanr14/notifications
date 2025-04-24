import { SendgridEmailSender } from './sendgrid.service';
import { CONFIG, Config } from '@app/config';

export const SENDGRID_EMAIL_PROVIDER = Symbol('SENDGRID_EMAIL_PROVIDER');

const SendgridServiceProvider = {
  provide: SENDGRID_EMAIL_PROVIDER,
  useFactory: (config: Config) => new SendgridEmailSender(config),
  inject: [CONFIG],
};

export default SendgridServiceProvider;

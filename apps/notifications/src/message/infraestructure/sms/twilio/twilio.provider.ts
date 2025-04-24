import { TwilioSmsSenderService } from './twilio.service';
import { CONFIG, Config } from '@app/config';

export const TWILIO_PROVIDER = Symbol('TWILIO_PROVIDER');

const TwilioServiceProvider = {
  provide: TWILIO_PROVIDER,
  useFactory: (config: Config) => new TwilioSmsSenderService(config),
  inject: [CONFIG],
};

export default TwilioServiceProvider;

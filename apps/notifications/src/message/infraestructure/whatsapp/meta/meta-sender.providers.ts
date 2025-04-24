import { MetaSenderService } from './meta-sender.service';
import { CONFIG, Config } from '@app/config';
import { HttpClientService } from '@app/shared';

export const META_PROVIDER = Symbol('META_PROVIDER');

const MetaSenderServiceProvider = {
  provide: META_PROVIDER,
  useFactory: (httpClient: HttpClientService, config: Config) =>
    new MetaSenderService(httpClient, config),
  inject: [HttpClientService, CONFIG],
};

export default MetaSenderServiceProvider;

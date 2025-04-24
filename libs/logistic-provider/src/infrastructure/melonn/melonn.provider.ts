import { Provider } from '@nestjs/common';
import { MelonnService } from './melonn.service';
import { HttpClientService } from '@app/shared';
import { CONFIG, Config } from '@app/config';

const MelonnServiceProvider = {
  provide: MelonnService,
  useFactory: (httpClient: HttpClientService, config: Config) =>
    new MelonnService(httpClient, config),
  inject: [HttpClientService, CONFIG],
};

const MelonnProviders: Provider[] = [MelonnServiceProvider];

export default MelonnProviders;

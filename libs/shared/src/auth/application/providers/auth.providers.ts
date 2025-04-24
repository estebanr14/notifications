import { Provider } from '@nestjs/common';
import { CONFIG, Config } from '../../../../../config/src';
import { AuthService } from '../auth.service';

const AuthServiceProvider = {
  provide: AuthService,
  useFactory: (config: Config) => new AuthService(config),
  inject: [CONFIG],
};

const AuthProviders: Provider[] = [AuthServiceProvider];

export default AuthProviders;

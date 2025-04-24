import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFactory from './config.factory';
import { Config } from './config.interface';

export const CONFIG = Symbol('CONFIG');

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [async () => configFactory()],
    }),
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: CONFIG,
      useFactory: (): Promise<Config> => configFactory(),
    },
  ],
  exports: [CONFIG],
})
export class BaseConfigModule {}

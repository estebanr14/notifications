// libs/shared/src/http/enhanced-http.module.ts
import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { HttpClientService } from './http-client.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 3,
        httpsAgent: new https.Agent({
          keepAlive: true,
          rejectUnauthorized: true,
        }),
      }),
    }),
  ],
  providers: [HttpClientService],
  exports: [HttpModule, HttpClientService],
})
export class HttpClientModule {}

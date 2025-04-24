import { Global, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { HttpExceptionFilter } from './exceptions';
import { LoggerInterceptor } from './interceptors/logger/logger.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';
import { NestCqrsCaller } from './cqrs/nest-cqrs-caller.service';
import { CqrsModule } from '@nestjs/cqrs';
import { BaseLoginHandler } from './auth';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { BaseConfigModule } from '../../config/src';
import { RmqSenderServiceProvider } from '@app/rabbit-mq';

const commamdHandlers = [BaseLoginHandler];

@Global()
@Module({
  imports: [CqrsModule, PassportModule, AuthModule, BaseConfigModule],
  providers: [
    ...commamdHandlers,
    SharedService,
    HttpExceptionFilter,
    LoggerInterceptor,
    TimeoutInterceptor,
    NestCqrsCaller,
    RmqSenderServiceProvider, // It shouldn't be here, but it's needed to inject the RmqSenderService, in rmq module it's not possible
  ],
  exports: [
    ...commamdHandlers,
    SharedService,
    HttpExceptionFilter,
    LoggerInterceptor,
    TimeoutInterceptor,
    NestCqrsCaller,
    RmqSenderServiceProvider, // It shouldn't be here, but it's needed to inject the RmqSenderService, in rmq module it's not possible
  ],
})
export class SharedModule {}

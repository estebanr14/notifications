import { BaseConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { RabbitMqModule } from '@app/rabbit-mq';
import { HttpClientModule, SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MessageModule } from './message/message.module';
@Module({
  imports: [
    BaseConfigModule,
    SharedModule,
    DatabaseModule,
    RabbitMqModule,
    HttpClientModule,
    CqrsModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
})
export class NotificationsModule {}

import { Global, Module } from '@nestjs/common';
import MelonnProviders from './infrastructure/melonn/melonn.provider';
import { CqrsModule } from '@nestjs/cqrs';
import { GetShipmentsQueryHandler } from './application/handlers/get-shipments.handler';
import { GetShipmentHandler } from './application/handlers/get-shipment.handler';

const queryHandlers = [GetShipmentsQueryHandler, GetShipmentHandler];

@Global()
@Module({
  imports: [CqrsModule],
  providers: [...MelonnProviders, ...queryHandlers],
  exports: [...MelonnProviders],
})
export class LogisticProviderModule {}

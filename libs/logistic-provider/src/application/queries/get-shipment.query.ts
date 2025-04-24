import { IQuery } from '@nestjs/cqrs';

export class GetShipmentQuery implements IQuery {
  constructor(public readonly externalOrderId: string) {}
}

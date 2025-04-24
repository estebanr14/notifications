import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetShipmentQuery } from '../queries/get-shipment.query';
import { MelonnService } from '@app/logistic-provider/infrastructure/melonn/melonn.service';

@QueryHandler(GetShipmentQuery)
export class GetShipmentHandler implements IQueryHandler<GetShipmentQuery> {
  constructor(private readonly melonnService: MelonnService) {}

  async execute(query: GetShipmentQuery): Promise<any> {
    return this.melonnService.getShipment(query.externalOrderId);
  }
}

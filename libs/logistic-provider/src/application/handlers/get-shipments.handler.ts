import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetShipmentsQuery } from '../queries/get-shipments.query';
import { MelonnService } from '../../infrastructure/melonn/melonn.service';

@QueryHandler(GetShipmentsQuery)
export class GetShipmentsQueryHandler
  implements IQueryHandler<GetShipmentsQuery>
{
  constructor(private readonly melonnService: MelonnService) {}

  async execute(): Promise<any> {
    return this.melonnService.getShipments();
  }
}

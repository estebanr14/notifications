import { IQuery } from '@nestjs/cqrs';

import { GetListMessageFiltersDto } from '../../presentation/dtos/get-list-messages.dto';
import { PaginationDto } from '@app/database';

export class GetListMessageQuery implements IQuery {
  constructor(
    public readonly filters: GetListMessageFiltersDto = {},
    public readonly pagination: PaginationDto = {
      page: 1,
      limit: 10,
      sortField: 'createdAt',
      sortOrder: 'ASC',
    },
  ) {}
}

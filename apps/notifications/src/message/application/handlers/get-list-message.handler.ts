import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { MessageMapper } from '../mappers/message.mapper';
import { MessageResponseDto } from '../../presentation/dtos/message.response.dto';
import { GetListMessageQuery } from '../queries/get-list-message.query';
import { PaginatedResult, PaginatedParams } from '@app/database';

@QueryHandler(GetListMessageQuery)
export class GetListMessageHandler
  implements IQueryHandler<GetListMessageQuery>
{
  private readonly logger = new Logger(GetListMessageHandler.name);

  constructor(private readonly messageService: MessageService) {}

  async execute(
    query: GetListMessageQuery,
  ): Promise<PaginatedResult<MessageResponseDto>> {
    this.logger.log(`[handler]: Executing query for Message`);

    const sortField = query.pagination.sortField || 'createdAt';
    const sortOrder =
      query.pagination.sortOrder?.toUpperCase() === 'ASC' ? 1 : -1;
    const params = new PaginatedParams(
      query.pagination.page,
      query.pagination.limit,
      { [sortField]: sortOrder },
      query.filters,
    );

    const paginatedResult = await this.messageService.findAll(params);

    return {
      ...paginatedResult,
      results: paginatedResult.results.map((entity) =>
        MessageMapper.toResponse(entity),
      ),
    };
  }
}

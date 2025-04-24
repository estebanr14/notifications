import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { MessageMapper } from '../mappers/message.mapper';
import { MessageResponseDto } from '../../presentation/dtos/message.response.dto';
import { GetMessageQuery } from '../queries/get-message.query';

@QueryHandler(GetMessageQuery)
export class GetMessageHandler implements IQueryHandler<GetMessageQuery> {
  private readonly logger = new Logger(GetMessageHandler.name);

  constructor(private readonly messageService: MessageService) {}

  async execute(query: GetMessageQuery): Promise<MessageResponseDto> {
    this.logger.log(`[handler]: Executing query for Message`);

    const entity = await this.messageService.findById(query.id);
    return MessageMapper.toResponse(entity);
  }
}

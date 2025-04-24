import { plainToInstance } from 'class-transformer';
import { Message } from '../../domain/entities/message.entity';
import { MessageResponseDto } from '../../presentation/dtos/message.response.dto';

export class MessageMapper {
  static toResponse(entity: Message): MessageResponseDto {
    return plainToInstance(MessageResponseDto, entity.toPrimitives());
  }
}

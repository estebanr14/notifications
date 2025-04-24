import { OmitType } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class MessageResponseDto extends OmitType(MessageDto, [
  'updatedAt',
] as const) {}

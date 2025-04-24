import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class CreateMessageDto extends PickType(MessageDto, [
  'to',
  'template',
  'templateArgs',
  'type',
  'category',
] as const) {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'file to send via email',
    required: false,
  })
  @IsOptional()
  file: Express.Multer.File;
}

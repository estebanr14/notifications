import { Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsObject, Allow } from 'class-validator';

export class MessageDto {
  private static readonly logger: Logger = new Logger(MessageDto.name);

  @ApiProperty({
    description: 'id',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly id: string;

  @ApiProperty({
    description: 'from',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly from: string;

  @ApiProperty({
    description: 'to',
    required: false,
  })
  @IsString()
  readonly to: string;

  @ApiProperty({
    description: 'template',
    required: true,
  })
  @IsString()
  readonly template: string;

  @ApiProperty({
    description: 'templateArgs',
    required: true,
    type: Object,
    example: {
      message: 'Hello, world!',
    },
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        MessageDto.logger.error('Error parsing templateArgs:', error);
        return value;
      }
    }
    return value;
  })
  @IsObject()
  @Allow()
  readonly templateArgs: object;

  @ApiProperty({
    description: 'sentAt',
    required: true,
  })
  @IsDate()
  readonly sentAt: Date;

  @ApiProperty({
    description: 'status',
    required: true,
  })
  @IsString()
  readonly status: string;

  @ApiProperty({
    description: 'error',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly error: string;

  @ApiProperty({
    description: 'platform',
    required: true,
  })
  @IsString()
  readonly platform: string;

  @ApiProperty({
    description: 'type',
    required: true,
  })
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: 'category',
    required: true,
  })
  @IsString()
  readonly category: string;

  @ApiProperty({
    description: 'createdAt',
    required: false,
  })
  @IsDate()
  @IsOptional()
  readonly createdAt: Date;

  @ApiProperty({
    description: 'updatedAt',
    required: false,
  })
  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;
}

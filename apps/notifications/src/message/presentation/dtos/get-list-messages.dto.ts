import { IntersectionType, PartialType } from '@nestjs/swagger';
import { MessageDto } from './message.dto';
import { PaginationDto } from '@app/database';

export class GetListMessageFiltersDto extends PartialType(MessageDto) {}

export class GetListMessageQueryDto extends IntersectionType(
  GetListMessageFiltersDto,
  PaginationDto,
) {}

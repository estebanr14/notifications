import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { SortOrder } from 'mongoose';

export interface PaginatedResult<T> {
  page: number;
  pages: number;
  total: number;
  limit: number;
  results: T[];
}

export class PaginatedParams {
  constructor(
    public page: number = 1,
    public limit: number = 10,
    public sort: { [key: string]: SortOrder } = { createdAt: -1 },
    public search: object = {},
  ) {}

  getValues() {
    return {
      page: this.page,
      limit: this.limit,
      sort: this.sort,
      search: this.search,
    };
  }
}

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  sortField?: string;

  @ApiPropertyOptional({
    description: 'Sort order (ASC or DESC)',
    example: 'DESC',
  })
  @IsString()
  @Matches(/^(ASC|DESC)$/i)
  @IsOptional()
  sortOrder?: string;
}

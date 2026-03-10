import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetadataDto {
  @ApiProperty({ example: 1, description: 'Current page number.' })
  page!: number;

  @ApiProperty({ example: 10, description: 'Page size.' })
  limit!: number;

  @ApiProperty({
    example: 45,
    description: 'Total number of records for current filter.',
  })
  total!: number;

  @ApiProperty({ example: 5, description: 'Total pages for current filter.' })
  totalPages!: number;
}

export function PaginatedOutputDto<TItem>(ItemClass: Type<TItem>) {
  class PaginatedOutputDtoClass {
    @ApiProperty({ type: ItemClass, isArray: true })
    items!: TItem[];

    @ApiProperty({ type: PaginatedMetadataDto })
    metadata!: PaginatedMetadataDto;
  }

  return PaginatedOutputDtoClass;
}

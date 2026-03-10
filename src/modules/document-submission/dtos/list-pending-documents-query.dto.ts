import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class ListPendingDocumentsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Page number.',
  })
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? 1 : Number(value),
  )
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Page size.',
  })
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? 10 : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Filter by employee id.',
  })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({
    example: 'Arthur',
    description: 'Filter by employee name (contains, case-insensitive).',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  employeeName?: string;

  @ApiPropertyOptional({
    example: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    description: 'Filter by document type id.',
  })
  @IsOptional()
  @IsUUID()
  documentTypeId?: string;

  @ApiPropertyOptional({
    example: 'RG',
    description: 'Filter by document type name (contains, case-insensitive).',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsOptional()
  @IsString()
  documentTypeName?: string;
}

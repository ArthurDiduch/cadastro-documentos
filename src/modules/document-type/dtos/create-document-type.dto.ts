import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDocumentTypeDto {
  @ApiProperty({
    example: 'ASO',
    minLength: 2,
    maxLength: 120,
    description: 'Unique document type name.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string'
      ? value.trim().replace(/\s+/g, ' ').toUpperCase()
      : value,
  )
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({
    example: 'Atestado de Saude Ocupacional',
    maxLength: 255,
    description: 'Optional document type description.',
    nullable: true,
  })
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') {
      const normalized = value.trim().replace(/\s+/g, ' ');
      return normalized.length ? normalized : null;
    }
    return value;
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description!: string | null;
}

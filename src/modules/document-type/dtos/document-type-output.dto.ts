import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';

export class DocumentTypeOutputDto {
  @ApiProperty({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Document type unique identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'ASO',
    description: 'Unique document type name.',
  })
  name!: string;

  @ApiProperty({
    example: 'Atestado de Saude Ocupacional',
    nullable: true,
    description: 'Optional document type description.',
  })
  description!: string | null;

  @ApiProperty({
    example: true,
    description: 'Whether document type is active (not soft deleted).',
  })
  isActive!: boolean;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Creation timestamp.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Last update timestamp.',
  })
  updatedAt!: Date;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Soft delete timestamp when document type is inactive.',
  })
  deletedAt!: Date | null;

  static fromDocumentType(
    documentType: DocumentTypeEntityInterface,
  ): DocumentTypeOutputDto {
    return Object.assign(new DocumentTypeOutputDto(), {
      ...documentType,
      isActive: documentType.deletedAt === null,
    });
  }
}

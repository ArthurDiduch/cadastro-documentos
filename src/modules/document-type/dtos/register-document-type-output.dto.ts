import { ApiProperty } from '@nestjs/swagger';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';

export class RegisterDocumentTypeOutputDto {
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
    example: '2026-03-10T12:00:00.000Z',
    description: 'Creation timestamp.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Last update timestamp.',
  })
  updatedAt!: Date;

  static fromDocumentType(
    documentType: DocumentTypeEntityInterface,
  ): RegisterDocumentTypeOutputDto {
    return Object.assign(new RegisterDocumentTypeOutputDto(), {
      id: documentType.id,
      name: documentType.name,
      description: documentType.description,
      createdAt: documentType.createdAt,
      updatedAt: documentType.updatedAt,
    });
  }
}

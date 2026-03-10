import { ApiProperty } from '@nestjs/swagger';
import { DocumentSubmissionEntityInterface } from '../interfaces/document-submission-entity.interface';

export class DocumentSubmissionOutputDto {
  @ApiProperty({
    example: '2c8f3267-4db4-4883-80ea-38f822db0af2',
    description: 'Document submission unique identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Employee id that owns the document submission.',
  })
  employeeId!: string;

  @ApiProperty({
    example: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    description: 'Required document type id for the employee.',
  })
  documentTypeId!: string;

  @ApiProperty({
    example: 'rg-frente.pdf',
    description: 'Logical file name sent by user.',
  })
  fileName!: string;

  @ApiProperty({
    example: 's3://bucket/documents/employee-1/rg-v2.pdf',
    description: 'Logical reference or path to the uploaded file.',
  })
  fileReference!: string;

  @ApiProperty({ example: 2, description: 'Sequential version number.' })
  version!: number;

  @ApiProperty({
    example: true,
    description: 'Indicates this is the latest active version.',
  })
  isCurrent!: boolean;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Submission timestamp.',
  })
  submittedAt!: Date;

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

  static fromDocumentSubmission(
    submission: DocumentSubmissionEntityInterface,
  ): DocumentSubmissionOutputDto {
    return Object.assign(new DocumentSubmissionOutputDto(), submission);
  }
}

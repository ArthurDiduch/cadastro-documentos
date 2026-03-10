import { ApiProperty } from '@nestjs/swagger';

export class MostPendingDocumentDto {
  @ApiProperty({
    example: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    description: 'Document type id.',
  })
  documentTypeId!: string;

  @ApiProperty({
    example: 'RG',
    description: 'Document type name.',
  })
  documentTypeName!: string;

  @ApiProperty({
    example: 17,
    description: 'Current pending count for this document type.',
  })
  pendingCount!: number;
}

export class LatestSubmissionDto {
  @ApiProperty({
    example: '2c8f3267-4db4-4883-80ea-38f822db0af2',
    description: 'Submission id.',
  })
  submissionId!: string;

  @ApiProperty({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Employee id.',
  })
  employeeId!: string;

  @ApiProperty({
    example: 'Arthur Diduch',
    description: 'Employee name.',
  })
  employeeName!: string;

  @ApiProperty({
    example: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    description: 'Document type id.',
  })
  documentTypeId!: string;

  @ApiProperty({
    example: 'RG',
    description: 'Document type name.',
  })
  documentTypeName!: string;

  @ApiProperty({
    example: 2,
    description: 'Document version number.',
  })
  version!: number;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Submission timestamp.',
  })
  submittedAt!: Date;
}

export class StatisticsOverviewOutputDto {
  @ApiProperty({
    example: 78.57,
    description: 'Current completion percentage for required documents.',
  })
  documentationCompletePercentage!: number;

  @ApiProperty({
    type: MostPendingDocumentDto,
    isArray: true,
    description: 'Document types most frequently pending.',
  })
  mostPendingDocuments!: MostPendingDocumentDto[];

  @ApiProperty({
    type: LatestSubmissionDto,
    isArray: true,
    description: 'Latest submissions across all employees.',
  })
  latestSubmissions!: LatestSubmissionDto[];
}

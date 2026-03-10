import { ApiProperty } from '@nestjs/swagger';

export class PendingDocumentOutputDto {
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
    example: '2026-03-10T12:00:00.000Z',
    description: 'Pending since (employee creation date).',
  })
  pendingSince!: Date;
}

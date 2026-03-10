import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LinkEmployeeDocumentTypeDto {
  @ApiProperty({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Employee id.',
  })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({
    example: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    description: 'Document type id.',
  })
  @IsNotEmpty()
  @IsUUID()
  documentTypeId!: string;
}

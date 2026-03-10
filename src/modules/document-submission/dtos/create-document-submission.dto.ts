import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDocumentSubmissionDto {
  @ApiProperty({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Employee id that owns the document submission.',
  })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({
    example: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    description: 'Required document type id for the employee.',
  })
  @IsNotEmpty()
  @IsUUID()
  documentTypeId!: string;

  @ApiProperty({
    example: 'rg-frente.pdf',
    minLength: 3,
    maxLength: 255,
    description: 'Logical file name sent by user.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fileName!: string;

  @ApiProperty({
    example: 's3://bucket/documents/employee-1/rg-v2.pdf',
    minLength: 3,
    maxLength: 255,
    description: 'Logical reference or path to the uploaded file.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fileReference!: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorItemDto {
  @ApiProperty({
    example: 'email',
    description: 'Field with validation failure.',
  })
  field!: string;

  @ApiProperty({
    example: 'email must be an email',
    description: 'Validation message for the field.',
  })
  message!: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code.',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'BAD_REQUEST',
    description: 'Stable error category.',
  })
  error!: string;

  @ApiProperty({
    example: 'Validation error in submitted data.',
    description: 'General validation failure message.',
  })
  message!: string;

  @ApiProperty({
    type: ValidationErrorItemDto,
    isArray: true,
    description: 'List of validation issues.',
  })
  errors!: ValidationErrorItemDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 409,
    description: 'HTTP status code.',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'EMPLOYEE_EMAIL_ALREADY_EXISTS',
    description: 'Stable application error code.',
  })
  error!: string;

  @ApiProperty({
    example: 'Employee email already exists.',
    description: 'Human-readable error message.',
  })
  message!: string;

  @ApiProperty({
    example: '/employees',
    description: 'Request path that produced the error.',
  })
  path!: string;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Timestamp when the error occurred.',
  })
  timestamp!: string;
}

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function setupGlobalPipes(): ValidationPipe {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const formatted = errors.flatMap((error) => {
        if (!error.constraints) return [];
        return Object.values(error.constraints).map((message) => ({
          field: error.property,
          message,
        }));
      });

      return new BadRequestException({
        statusCode: 400,
        error: 'BAD_REQUEST',
        message: 'Validation error in submitted data.',
        errors: formatted,
      });
    },
  });
}

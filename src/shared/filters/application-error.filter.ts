import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DocumentTypeNameAlreadyExistsError } from 'src/modules/document-type/errors/document-type-name-already-exists.error';
import { DocumentTypeNotFoundError } from 'src/modules/document-type/errors/document-type-not-found.error';
import { EmployeeEmailAlreadyExistsError } from 'src/modules/employee/errors/employee-email-already-exists.error';
import { EmployeeNotFoundError } from 'src/modules/employee/errors/employee-not-found.error';
import { EmployeeRegistrationAlreadyExistsError } from 'src/modules/employee/errors/employee-registration-already-exists.error';
import { ApplicationError } from '../errors/application.error';

@Catch(ApplicationError)
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: ApplicationError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const statusCode = this.mapStatusCode(exception);

    response.status(statusCode).json({
      statusCode,
      error: exception.code,
      message: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapStatusCode(exception: ApplicationError): number {
    if (
      exception instanceof EmployeeEmailAlreadyExistsError ||
      exception instanceof EmployeeRegistrationAlreadyExistsError ||
      exception instanceof DocumentTypeNameAlreadyExistsError
    ) {
      return HttpStatus.CONFLICT;
    }

    if (
      exception instanceof EmployeeNotFoundError ||
      exception instanceof DocumentTypeNotFoundError
    ) {
      return HttpStatus.NOT_FOUND;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

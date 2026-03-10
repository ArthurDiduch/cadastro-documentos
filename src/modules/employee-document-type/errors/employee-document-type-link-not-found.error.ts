import { ApplicationError } from 'src/shared/errors/application.error';

export class EmployeeDocumentTypeLinkNotFoundError extends ApplicationError {
  static create(
    employeeId: string,
    documentTypeId: string,
  ): EmployeeDocumentTypeLinkNotFoundError {
    return new EmployeeDocumentTypeLinkNotFoundError(
      employeeId,
      documentTypeId,
    );
  }

  constructor(employeeId: string, documentTypeId: string) {
    super(
      'EMPLOYEE_DOCUMENT_TYPE_LINK_NOT_FOUND',
      `Employee ${employeeId} is not linked to document type ${documentTypeId}.`,
    );
  }
}

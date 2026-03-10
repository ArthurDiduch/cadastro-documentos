import { ApplicationError } from 'src/shared/errors/application.error';

export class EmployeeDocumentTypeAlreadyLinkedError extends ApplicationError {
  static create(): EmployeeDocumentTypeAlreadyLinkedError {
    return new EmployeeDocumentTypeAlreadyLinkedError();
  }

  constructor() {
    super(
      'EMPLOYEE_DOCUMENT_TYPE_ALREADY_LINKED',
      'Employee is already linked to this document type.',
    );
  }
}

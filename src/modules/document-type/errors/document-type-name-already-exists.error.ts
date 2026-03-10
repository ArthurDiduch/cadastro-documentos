import { ApplicationError } from 'src/shared/errors/application.error';

export class DocumentTypeNameAlreadyExistsError extends ApplicationError {
  static create(): DocumentTypeNameAlreadyExistsError {
    return new DocumentTypeNameAlreadyExistsError();
  }

  constructor() {
    super(
      'DOCUMENT_TYPE_NAME_ALREADY_EXISTS',
      'Document type name already exists.',
    );
  }
}

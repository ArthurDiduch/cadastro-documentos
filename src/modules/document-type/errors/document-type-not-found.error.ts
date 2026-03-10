import { ApplicationError } from 'src/shared/errors/application.error';

export class DocumentTypeNotFoundError extends ApplicationError {
  static create(id: string): DocumentTypeNotFoundError {
    return new DocumentTypeNotFoundError(id);
  }

  constructor(id: string) {
    super(
      'DOCUMENT_TYPE_NOT_FOUND',
      `Document type with id ${id} was not found.`,
    );
  }
}

import { EmployeeNotFoundError } from 'src/modules/employee/errors/employee-not-found.error';
import { DocumentSubmissionEntityInterface } from '../interfaces/document-submission-entity.interface';
import { AbstractDocumentSubmissionRepository } from '../repositories/document-submission.repository.abstract';
import { SubmitDocumentUseCase } from './submit-document.use-case';

type RepositoryMock = {
  findOne: jest.Mock;
};

type DocumentSubmissionRepositoryMock = {
  createNewVersion: jest.Mock;
  findPendingDocuments: jest.Mock;
};

describe('SubmitDocumentUseCase', () => {
  let useCase: SubmitDocumentUseCase;
  let employeeRepository: RepositoryMock;
  let documentTypeRepository: RepositoryMock;
  let documentSubmissionRepository: DocumentSubmissionRepositoryMock;

  beforeEach(() => {
    employeeRepository = {
      findOne: jest.fn(),
    };

    documentTypeRepository = {
      findOne: jest.fn(),
    };

    documentSubmissionRepository = {
      createNewVersion: jest.fn(),
      findPendingDocuments: jest.fn(),
    };

    useCase = new SubmitDocumentUseCase(
      documentSubmissionRepository as unknown as AbstractDocumentSubmissionRepository,
      employeeRepository as unknown as never,
      documentTypeRepository as unknown as never,
    );
  });

  it('submits a new document version when employee and document type exist', async () => {
    const input = {
      employeeId: 'emp-1',
      documentTypeId: 'doc-1',
      fileName: 'rg-frente.pdf',
      fileReference: 's3://bucket/rg-frente-v1.pdf',
    };

    employeeRepository.findOne.mockResolvedValue({ id: 'emp-1' });
    documentTypeRepository.findOne.mockResolvedValue({ id: 'doc-1' });
    documentSubmissionRepository.createNewVersion.mockResolvedValue(
      buildSubmissionEntity(),
    );

    await expect(useCase.execute(input)).resolves.toMatchObject({
      employeeId: 'emp-1',
      documentTypeId: 'doc-1',
      version: 1,
      isCurrent: true,
    });
  });

  it('throws when employee does not exist', async () => {
    const input = {
      employeeId: 'missing',
      documentTypeId: 'doc-1',
      fileName: 'rg-frente.pdf',
      fileReference: 's3://bucket/rg-frente-v1.pdf',
    };

    employeeRepository.findOne.mockResolvedValue(null);
    documentTypeRepository.findOne.mockResolvedValue({ id: 'doc-1' });

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      EmployeeNotFoundError,
    );
  });
});

function buildSubmissionEntity(
  overrides: Partial<DocumentSubmissionEntityInterface> = {},
): DocumentSubmissionEntityInterface {
  return {
    id: 'sub-1',
    employeeId: 'emp-1',
    documentTypeId: 'doc-1',
    fileName: 'rg-frente.pdf',
    fileReference: 's3://bucket/rg-frente-v1.pdf',
    version: 1,
    isCurrent: true,
    submittedAt: new Date('2026-03-10T12:00:00.000Z'),
    createdAt: new Date('2026-03-10T12:00:00.000Z'),
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

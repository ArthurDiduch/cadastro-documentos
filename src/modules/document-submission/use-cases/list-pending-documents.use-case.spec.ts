import { AbstractDocumentSubmissionRepository } from '../repositories/document-submission.repository.abstract';
import { ListPendingDocumentsUseCase } from './list-pending-documents.use-case';

type DocumentSubmissionRepositoryMock = {
  createNewVersion: jest.Mock;
  findPendingDocuments: jest.Mock;
};

describe('ListPendingDocumentsUseCase', () => {
  let useCase: ListPendingDocumentsUseCase;
  let documentSubmissionRepository: DocumentSubmissionRepositoryMock;

  beforeEach(() => {
    documentSubmissionRepository = {
      createNewVersion: jest.fn(),
      findPendingDocuments: jest.fn(),
    };

    useCase = new ListPendingDocumentsUseCase(
      documentSubmissionRepository as unknown as AbstractDocumentSubmissionRepository,
    );
  });

  it('returns paginated pending documents', async () => {
    documentSubmissionRepository.findPendingDocuments.mockResolvedValue({
      items: [
        {
          employeeId: 'emp-1',
          employeeName: 'Arthur',
          documentTypeId: 'doc-1',
          documentTypeName: 'RG',
          pendingSince: new Date('2026-03-10T12:00:00.000Z'),
        },
      ],
      total: 1,
    });

    await expect(
      useCase.execute({ page: 1, limit: 10, employeeName: 'Arthur' }),
    ).resolves.toMatchObject({
      items: [
        {
          employeeId: 'emp-1',
          documentTypeId: 'doc-1',
        },
      ],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  });
});

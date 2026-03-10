import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';
import { ReactivateDocumentTypeUseCase } from './reactivate-document-type.use-case';
import { SoftDeleteDocumentTypeUseCase } from './soft-delete-document-type.use-case';

type DocumentTypeRepositoryMock = {
  create: jest.Mock;
  save: jest.Mock;
  update: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  findAndCount: jest.Mock;
  softDelete: jest.Mock;
  restore: jest.Mock;
};

describe('SoftDeleteDocumentTypeUseCase and ReactivateDocumentTypeUseCase', () => {
  let softDeleteUseCase: SoftDeleteDocumentTypeUseCase;
  let reactivateUseCase: ReactivateDocumentTypeUseCase;
  let documentTypeRepository: DocumentTypeRepositoryMock;

  beforeEach(() => {
    documentTypeRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
    };

    softDeleteUseCase = new SoftDeleteDocumentTypeUseCase(
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
    );
    reactivateUseCase = new ReactivateDocumentTypeUseCase(
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
    );
  });

  it('soft deletes an active document type', async () => {
    documentTypeRepository.findOne.mockResolvedValue(buildDocumentTypeEntity());
    documentTypeRepository.softDelete.mockResolvedValue({} as never);

    await expect(softDeleteUseCase.execute('doc-1')).resolves.toBeUndefined();
    expect(documentTypeRepository.softDelete).toHaveBeenCalledWith({
      id: 'doc-1',
    });
  });

  it('throws on soft delete when document type does not exist', async () => {
    documentTypeRepository.findOne.mockResolvedValue(null);

    await expect(softDeleteUseCase.execute('missing')).rejects.toBeInstanceOf(
      DocumentTypeNotFoundError,
    );
  });

  it('reactivates an inactive document type', async () => {
    documentTypeRepository.findOne
      .mockResolvedValueOnce(buildDocumentTypeEntity({ deletedAt: new Date() }))
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildDocumentTypeEntity());
    documentTypeRepository.restore.mockResolvedValue({} as never);

    await expect(reactivateUseCase.execute('doc-1')).resolves.toMatchObject({
      id: 'doc-1',
      isActive: true,
    });
  });
});

function buildDocumentTypeEntity(
  overrides: Partial<DocumentTypeEntityInterface> = {},
): DocumentTypeEntityInterface {
  return {
    id: 'doc-1',
    name: 'ASO',
    description: 'Atestado de Saude Ocupacional',
    createdAt: new Date('2026-03-10T12:00:00.000Z'),
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

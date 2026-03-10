import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';
import { UpdateDocumentTypeUseCase } from './update-document-type.use-case';

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

describe('UpdateDocumentTypeUseCase', () => {
  let useCase: UpdateDocumentTypeUseCase;
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

    useCase = new UpdateDocumentTypeUseCase(
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
    );
  });

  it('updates an active document type', async () => {
    const current = buildDocumentTypeEntity();
    const updated = buildDocumentTypeEntity({ name: 'CERTIDAO' });

    documentTypeRepository.findOne
      .mockResolvedValueOnce(current)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(updated);
    documentTypeRepository.update.mockResolvedValue({} as never);

    await expect(
      useCase.execute('doc-1', { name: 'CERTIDAO' }),
    ).resolves.toMatchObject({
      id: 'doc-1',
      name: 'CERTIDAO',
      isActive: true,
    });
  });

  it('throws when document type is not found', async () => {
    documentTypeRepository.findOne.mockResolvedValue(null);

    await expect(
      useCase.execute('missing', { name: 'ANY' }),
    ).rejects.toBeInstanceOf(DocumentTypeNotFoundError);
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

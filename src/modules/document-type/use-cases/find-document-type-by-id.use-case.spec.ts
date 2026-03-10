import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';
import { FindDocumentTypeByIdUseCase } from './find-document-type-by-id.use-case';

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

describe('FindDocumentTypeByIdUseCase', () => {
  let useCase: FindDocumentTypeByIdUseCase;
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

    useCase = new FindDocumentTypeByIdUseCase(
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
    );
  });

  it('returns document type by id', async () => {
    documentTypeRepository.findOne.mockResolvedValue(buildDocumentTypeEntity());

    await expect(useCase.execute('doc-1')).resolves.toMatchObject({
      id: 'doc-1',
      isActive: true,
    });
  });

  it('throws when document type does not exist', async () => {
    documentTypeRepository.findOne.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      DocumentTypeNotFoundError,
    );
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

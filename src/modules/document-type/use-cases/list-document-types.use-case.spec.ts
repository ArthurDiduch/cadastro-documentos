import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';
import { ListDocumentTypesUseCase } from './list-document-types.use-case';

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

describe('ListDocumentTypesUseCase', () => {
  let useCase: ListDocumentTypesUseCase;
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

    useCase = new ListDocumentTypesUseCase(
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
    );
  });

  it('returns paginated document types', async () => {
    documentTypeRepository.findAndCount.mockResolvedValue([
      [buildDocumentTypeEntity()],
      1,
    ]);

    await expect(
      useCase.execute({ page: 1, limit: 10, isActive: true }),
    ).resolves.toMatchObject({
      items: [
        {
          id: 'doc-1',
          isActive: true,
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

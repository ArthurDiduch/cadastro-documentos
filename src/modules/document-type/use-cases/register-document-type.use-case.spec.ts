import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';
import { DocumentTypeNameAlreadyExistsError } from '../errors/document-type-name-already-exists.error';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';
import { RegisterDocumentTypeUseCase } from './register-document-type.use-case';

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

describe('RegisterDocumentTypeUseCase', () => {
  let useCase: RegisterDocumentTypeUseCase;
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

    useCase = new RegisterDocumentTypeUseCase(
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
    );
  });

  it('registers a document type when name is available', async () => {
    const createDocumentTypeDto = {
      name: 'ASO',
      description: 'Atestado de Saude Ocupacional',
    };
    const persistedDocumentType = buildDocumentTypeEntity(
      createDocumentTypeDto,
    );

    documentTypeRepository.findOne.mockResolvedValue(null);
    documentTypeRepository.create.mockReturnValue(persistedDocumentType);
    documentTypeRepository.save.mockResolvedValue(persistedDocumentType);

    await expect(useCase.execute(createDocumentTypeDto)).resolves.toEqual({
      id: persistedDocumentType.id,
      name: persistedDocumentType.name,
      description: persistedDocumentType.description,
      createdAt: persistedDocumentType.createdAt,
      updatedAt: persistedDocumentType.updatedAt,
    });
  });

  it('throws when the name is already registered', async () => {
    const createDocumentTypeDto = {
      name: 'ASO',
      description: 'Atestado de Saude Ocupacional',
    };

    documentTypeRepository.findOne.mockResolvedValue(
      buildDocumentTypeEntity(createDocumentTypeDto),
    );

    await expect(useCase.execute(createDocumentTypeDto)).rejects.toBeInstanceOf(
      DocumentTypeNameAlreadyExistsError,
    );
    expect(documentTypeRepository.save.mock.calls).toHaveLength(0);
  });
});

function buildDocumentTypeEntity(
  overrides: Partial<DocumentTypeEntityInterface> = {},
): DocumentTypeEntityInterface {
  return {
    id: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    name: 'ASO',
    description: 'Atestado de Saude Ocupacional',
    createdAt: new Date('2026-03-10T12:00:00.000Z'),
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

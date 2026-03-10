import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { setupGlobalPipes } from '../src/configurations/global-pipes.config';
import { DocumentTypeController } from '../src/modules/document-type/controllers/document-type.controller';
import { DocumentTypeEntityInterface } from '../src/modules/document-type/interfaces/document-type-entity.interface';
import { AbstractDocumentTypeRepository } from '../src/modules/document-type/repositories/document-type.repository.abstract';
import { FindDocumentTypeByIdUseCase } from '../src/modules/document-type/use-cases/find-document-type-by-id.use-case';
import { ListDocumentTypesUseCase } from '../src/modules/document-type/use-cases/list-document-types.use-case';
import { ReactivateDocumentTypeUseCase } from '../src/modules/document-type/use-cases/reactivate-document-type.use-case';
import { RegisterDocumentTypeUseCase } from '../src/modules/document-type/use-cases/register-document-type.use-case';
import { SoftDeleteDocumentTypeUseCase } from '../src/modules/document-type/use-cases/soft-delete-document-type.use-case';
import { UpdateDocumentTypeUseCase } from '../src/modules/document-type/use-cases/update-document-type.use-case';
import { ApplicationErrorFilter } from '../src/shared/filters/application-error.filter';

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

describe('DocumentTypeController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let documentTypeRepository: DocumentTypeRepositoryMock;

  beforeEach(async () => {
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [DocumentTypeController],
      providers: [
        RegisterDocumentTypeUseCase,
        FindDocumentTypeByIdUseCase,
        ListDocumentTypesUseCase,
        UpdateDocumentTypeUseCase,
        SoftDeleteDocumentTypeUseCase,
        ReactivateDocumentTypeUseCase,
        {
          provide: AbstractDocumentTypeRepository,
          useValue:
            documentTypeRepository as unknown as AbstractDocumentTypeRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(setupGlobalPipes());
    app.useGlobalFilters(new ApplicationErrorFilter());

    await app.init();
    const server: unknown = app.getHttpServer();
    httpServer = server as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /document-types returns 201 when payload is valid', async () => {
    const payload = {
      name: 'ASO',
      description: 'Atestado de Saude Ocupacional',
    };
    const documentType = buildDocumentTypeEntity(payload);

    documentTypeRepository.findOne.mockResolvedValueOnce(null);
    documentTypeRepository.create.mockReturnValue(documentType);
    documentTypeRepository.save.mockResolvedValue(documentType);

    const response = await request(httpServer)
      .post('/document-types')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      id: documentType.id,
      name: documentType.name,
      description: documentType.description,
      createdAt: documentType.createdAt.toISOString(),
      updatedAt: documentType.updatedAt.toISOString(),
    });
  });

  it('GET /document-types/:id returns 200 for active document type', async () => {
    const documentType = buildDocumentTypeEntity();
    documentTypeRepository.findOne.mockResolvedValue(documentType);

    const response = await request(httpServer)
      .get(`/document-types/${documentType.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: documentType.id,
      isActive: true,
    });
  });

  it('GET /document-types returns paginated payload', async () => {
    const documentType = buildDocumentTypeEntity();
    documentTypeRepository.findAndCount.mockResolvedValue([[documentType], 1]);

    const response = await request(httpServer)
      .get('/document-types?page=1&limit=10&isActive=true')
      .expect(200);

    expect(response.body).toMatchObject({
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });

    const items = (response.body as { items: unknown[] }).items;
    expect(items).toHaveLength(1);
  });

  it('PATCH /document-types/:id updates document type', async () => {
    const documentType = buildDocumentTypeEntity();
    const updatedDocumentType = buildDocumentTypeEntity({ name: 'CERTIDAO' });

    documentTypeRepository.findOne
      .mockResolvedValueOnce(documentType)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(updatedDocumentType);
    documentTypeRepository.update.mockResolvedValue({} as never);

    const response = await request(httpServer)
      .patch(`/document-types/${documentType.id}`)
      .send({ name: 'CERTIDAO' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: documentType.id,
      name: 'CERTIDAO',
      isActive: true,
    });
  });

  it('DELETE /document-types/:id returns 204', async () => {
    const documentType = buildDocumentTypeEntity();
    documentTypeRepository.findOne.mockResolvedValue(documentType);
    documentTypeRepository.softDelete.mockResolvedValue({} as never);

    await request(httpServer)
      .delete(`/document-types/${documentType.id}`)
      .expect(204);
  });

  it('PATCH /document-types/:id/reactivate returns 200', async () => {
    const documentType = buildDocumentTypeEntity({ deletedAt: new Date() });

    documentTypeRepository.findOne
      .mockResolvedValueOnce(documentType)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildDocumentTypeEntity());
    documentTypeRepository.restore.mockResolvedValue({} as never);

    const response = await request(httpServer)
      .patch(`/document-types/${documentType.id}/reactivate`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: documentType.id,
      isActive: true,
    });
  });

  it('documents key document type routes in Swagger', () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Test').build(),
    );

    expect(document.paths['/document-types']?.post).toBeDefined();
    expect(document.paths['/document-types']?.get).toBeDefined();
    expect(document.paths['/document-types/{id}']?.get).toBeDefined();
    expect(document.paths['/document-types/{id}']?.patch).toBeDefined();
    expect(document.paths['/document-types/{id}']?.delete).toBeDefined();
    expect(
      document.paths['/document-types/{id}/reactivate']?.patch,
    ).toBeDefined();
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

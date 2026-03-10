import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { setupGlobalPipes } from '../src/configurations/global-pipes.config';
import { DocumentSubmissionController } from '../src/modules/document-submission/controllers/document-submission.controller';
import { DocumentSubmissionEntityInterface } from '../src/modules/document-submission/interfaces/document-submission-entity.interface';
import { AbstractDocumentSubmissionRepository } from '../src/modules/document-submission/repositories/document-submission.repository.abstract';
import { ListPendingDocumentsUseCase } from '../src/modules/document-submission/use-cases/list-pending-documents.use-case';
import { SubmitDocumentUseCase } from '../src/modules/document-submission/use-cases/submit-document.use-case';
import { AbstractDocumentTypeRepository } from '../src/modules/document-type/repositories/document-type.repository.abstract';
import { AbstractEmployeeRepository } from '../src/modules/employee/repositories/employee.repository.abstract';
import { ApplicationErrorFilter } from '../src/shared/filters/application-error.filter';

type RepositoryMock = {
  findOne: jest.Mock;
};

type DocumentSubmissionRepositoryMock = {
  createNewVersion: jest.Mock;
  findPendingDocuments: jest.Mock;
};

describe('DocumentSubmissionController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let employeeRepository: RepositoryMock;
  let documentTypeRepository: RepositoryMock;
  let documentSubmissionRepository: DocumentSubmissionRepositoryMock;

  beforeEach(async () => {
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [DocumentSubmissionController],
      providers: [
        SubmitDocumentUseCase,
        ListPendingDocumentsUseCase,
        {
          provide: AbstractDocumentSubmissionRepository,
          useValue:
            documentSubmissionRepository as unknown as AbstractDocumentSubmissionRepository,
        },
        {
          provide: AbstractEmployeeRepository,
          useValue: employeeRepository,
        },
        {
          provide: AbstractDocumentTypeRepository,
          useValue: documentTypeRepository,
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

  it('POST /document-submissions returns 201 for valid payload', async () => {
    const payload = {
      employeeId: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
      documentTypeId: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
      fileName: 'rg-frente.pdf',
      fileReference: 's3://bucket/documents/employee-1/rg-v1.pdf',
    };

    employeeRepository.findOne.mockResolvedValue({ id: payload.employeeId });
    documentTypeRepository.findOne.mockResolvedValue({
      id: payload.documentTypeId,
    });
    documentSubmissionRepository.createNewVersion.mockResolvedValue(
      buildSubmissionEntity({
        employeeId: payload.employeeId,
        documentTypeId: payload.documentTypeId,
        fileName: payload.fileName,
        fileReference: payload.fileReference,
      }),
    );

    const response = await request(httpServer)
      .post('/document-submissions')
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      employeeId: payload.employeeId,
      documentTypeId: payload.documentTypeId,
      fileName: payload.fileName,
      fileReference: payload.fileReference,
      version: 1,
      isCurrent: true,
    });
  });

  it('GET /document-submissions/pending returns paginated payload', async () => {
    documentSubmissionRepository.findPendingDocuments.mockResolvedValue({
      items: [
        {
          employeeId: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
          employeeName: 'Arthur Diduch',
          documentTypeId: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
          documentTypeName: 'RG',
          pendingSince: new Date('2026-03-10T12:00:00.000Z'),
        },
      ],
      total: 1,
    });

    const response = await request(httpServer)
      .get('/document-submissions/pending?page=1&limit=10&employeeName=Arthur')
      .expect(200);

    expect(response.body).toMatchObject({
      items: [
        {
          employeeName: 'Arthur Diduch',
          documentTypeName: 'RG',
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

  it('documents submit route in Swagger', () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Test').build(),
    );

    expect(document.paths['/document-submissions']?.post).toBeDefined();
    expect(document.paths['/document-submissions/pending']?.get).toBeDefined();
  });
});

function buildSubmissionEntity(
  overrides: Partial<DocumentSubmissionEntityInterface> = {},
): DocumentSubmissionEntityInterface {
  return {
    id: 'sub-1',
    employeeId: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    documentTypeId: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
    fileName: 'rg-frente.pdf',
    fileReference: 's3://bucket/documents/employee-1/rg-v1.pdf',
    version: 1,
    isCurrent: true,
    submittedAt: new Date('2026-03-10T12:00:00.000Z'),
    createdAt: new Date('2026-03-10T12:00:00.000Z'),
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

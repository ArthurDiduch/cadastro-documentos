import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { setupGlobalPipes } from '../src/configurations/global-pipes.config';
import { AbstractDocumentTypeRepository } from '../src/modules/document-type/repositories/document-type.repository.abstract';
import { EmployeeDocumentTypeController } from '../src/modules/employee-document-type/controllers/employee-document-type.controller';
import { AbstractEmployeeDocumentTypeRepository } from '../src/modules/employee-document-type/repositories/employee-document-type.repository.abstract';
import { LinkEmployeeDocumentTypeUseCase } from '../src/modules/employee-document-type/use-cases/link-employee-document-type.use-case';
import { UnlinkEmployeeDocumentTypeUseCase } from '../src/modules/employee-document-type/use-cases/unlink-employee-document-type.use-case';
import { AbstractEmployeeRepository } from '../src/modules/employee/repositories/employee.repository.abstract';
import { ApplicationErrorFilter } from '../src/shared/filters/application-error.filter';

type EmployeeRepositoryMock = {
  findOne: jest.Mock;
};

type DocumentTypeRepositoryMock = {
  findOne: jest.Mock;
};

type EmployeeDocumentTypeRepositoryMock = {
  findOne: jest.Mock;
  linkWithPendingAtomic: jest.Mock;
  unlinkWithPendingAtomic: jest.Mock;
};

describe('EmployeeDocumentTypeController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let employeeRepository: EmployeeRepositoryMock;
  let documentTypeRepository: DocumentTypeRepositoryMock;
  let employeeDocumentTypeRepository: EmployeeDocumentTypeRepositoryMock;

  beforeEach(async () => {
    employeeRepository = { findOne: jest.fn() };
    documentTypeRepository = { findOne: jest.fn() };
    employeeDocumentTypeRepository = {
      findOne: jest.fn(),
      linkWithPendingAtomic: jest.fn(),
      unlinkWithPendingAtomic: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeDocumentTypeController],
      providers: [
        LinkEmployeeDocumentTypeUseCase,
        UnlinkEmployeeDocumentTypeUseCase,
        {
          provide: AbstractEmployeeRepository,
          useValue: employeeRepository,
        },
        {
          provide: AbstractDocumentTypeRepository,
          useValue: documentTypeRepository,
        },
        {
          provide: AbstractEmployeeDocumentTypeRepository,
          useValue: employeeDocumentTypeRepository,
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

  it('POST /employee-document-types links employee to document type', async () => {
    employeeRepository.findOne.mockResolvedValue({ id: 'emp-1' });
    documentTypeRepository.findOne.mockResolvedValue({ id: 'doc-1' });
    employeeDocumentTypeRepository.findOne.mockResolvedValue(null);

    await request(httpServer)
      .post('/employee-document-types')
      .send({
        employeeId: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
        documentTypeId: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
      })
      .expect(204);
  });

  it('DELETE /employee-document-types unlinks employee from document type', async () => {
    employeeDocumentTypeRepository.findOne.mockResolvedValue({ id: 'link-1' });

    await request(httpServer)
      .delete('/employee-document-types')
      .send({
        employeeId: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
        documentTypeId: '09f10f9e-c13a-4c1b-a84d-559d371f040b',
      })
      .expect(204);
  });

  it('documents employee-document-type routes in Swagger', () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Test').build(),
    );

    expect(document.paths['/employee-document-types']?.post).toBeDefined();
    expect(document.paths['/employee-document-types']?.delete).toBeDefined();
  });
});

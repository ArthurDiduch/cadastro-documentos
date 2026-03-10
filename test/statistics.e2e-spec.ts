import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { setupGlobalPipes } from '../src/configurations/global-pipes.config';
import { StatisticsController } from '../src/modules/statistics/controllers/statistics.controller';
import { AbstractStatisticsRepository } from '../src/modules/statistics/repositories/statistics.repository.abstract';
import { GetStatisticsOverviewUseCase } from '../src/modules/statistics/use-cases/get-statistics-overview.use-case';

type StatisticsRepositoryMock = {
  getOverview: jest.Mock;
};

describe('StatisticsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let statisticsRepository: StatisticsRepositoryMock;

  beforeEach(async () => {
    statisticsRepository = {
      getOverview: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        GetStatisticsOverviewUseCase,
        {
          provide: AbstractStatisticsRepository,
          useValue:
            statisticsRepository as unknown as AbstractStatisticsRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(setupGlobalPipes());

    await app.init();
    const server: unknown = app.getHttpServer();
    httpServer = server as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /statistics/overview returns statistics overview', async () => {
    statisticsRepository.getOverview.mockResolvedValue({
      documentationCompletePercentage: 75,
      mostPendingDocuments: [
        {
          documentTypeId: 'doc-1',
          documentTypeName: 'RG',
          pendingCount: 10,
        },
      ],
      latestSubmissions: [
        {
          submissionId: 'sub-1',
          employeeId: 'emp-1',
          employeeName: 'Arthur',
          documentTypeId: 'doc-1',
          documentTypeName: 'RG',
          version: 2,
          submittedAt: new Date('2026-03-10T12:00:00.000Z').toISOString(),
        },
      ],
    });

    const response = await request(httpServer)
      .get('/statistics/overview?topPendingLimit=5&latestSubmissionsLimit=10')
      .expect(200);

    expect(response.body).toMatchObject({
      documentationCompletePercentage: 75,
      mostPendingDocuments: [
        {
          documentTypeName: 'RG',
          pendingCount: 10,
        },
      ],
      latestSubmissions: [
        {
          employeeName: 'Arthur',
          documentTypeName: 'RG',
          version: 2,
        },
      ],
    });
  });

  it('documents statistics route in Swagger', () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Test').build(),
    );

    expect(document.paths['/statistics/overview']?.get).toBeDefined();
  });
});

import { StatisticsOverviewOutputDto } from '../dtos/statistics-overview-output.dto';
import { AbstractStatisticsRepository } from '../repositories/statistics.repository.abstract';
import { GetStatisticsOverviewUseCase } from './get-statistics-overview.use-case';

type StatisticsRepositoryMock = {
  getOverview: jest.Mock;
};

describe('GetStatisticsOverviewUseCase', () => {
  let useCase: GetStatisticsOverviewUseCase;
  let statisticsRepository: StatisticsRepositoryMock;

  beforeEach(() => {
    statisticsRepository = {
      getOverview: jest.fn(),
    };

    useCase = new GetStatisticsOverviewUseCase(
      statisticsRepository as unknown as AbstractStatisticsRepository,
    );
  });

  it('returns statistics overview', async () => {
    const overview: StatisticsOverviewOutputDto = {
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
          submittedAt: new Date('2026-03-10T12:00:00.000Z'),
        },
      ],
    };

    statisticsRepository.getOverview.mockResolvedValue(overview);

    await expect(
      useCase.execute({ topPendingLimit: 5, latestSubmissionsLimit: 10 }),
    ).resolves.toEqual(overview);
  });
});

import { Module } from '@nestjs/common';
import { StatisticsController } from './controllers/statistics.controller';
import { StatisticsRepository } from './repositories/statistics.repository';
import { AbstractStatisticsRepository } from './repositories/statistics.repository.abstract';
import { GetStatisticsOverviewUseCase } from './use-cases/get-statistics-overview.use-case';

@Module({
  controllers: [StatisticsController],
  providers: [
    {
      provide: AbstractStatisticsRepository,
      useClass: StatisticsRepository,
    },
    GetStatisticsOverviewUseCase,
  ],
})
export class StatisticsModule {}

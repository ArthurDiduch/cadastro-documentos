import { Injectable } from '@nestjs/common';
import { StatisticsOverviewOutputDto } from '../dtos/statistics-overview-output.dto';
import { StatisticsOverviewQueryDto } from '../dtos/statistics-overview-query.dto';
import { AbstractStatisticsRepository } from '../repositories/statistics.repository.abstract';

@Injectable()
export class GetStatisticsOverviewUseCase {
  constructor(
    private readonly statisticsRepository: AbstractStatisticsRepository,
  ) {}

  async execute(
    query: StatisticsOverviewQueryDto,
  ): Promise<StatisticsOverviewOutputDto> {
    return this.statisticsRepository.getOverview(query);
  }
}

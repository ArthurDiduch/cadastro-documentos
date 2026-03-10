import { StatisticsOverviewOutputDto } from '../dtos/statistics-overview-output.dto';
import { StatisticsOverviewQueryDto } from '../dtos/statistics-overview-query.dto';

export abstract class AbstractStatisticsRepository {
  abstract getOverview(
    query: StatisticsOverviewQueryDto,
  ): Promise<StatisticsOverviewOutputDto>;
}

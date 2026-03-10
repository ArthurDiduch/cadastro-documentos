import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidationErrorResponseDto } from 'src/shared/dtos/validation-error-response.dto';
import { StatisticsOverviewOutputDto } from '../dtos/statistics-overview-output.dto';
import { StatisticsOverviewQueryDto } from '../dtos/statistics-overview-query.dto';
import { GetStatisticsOverviewUseCase } from '../use-cases/get-statistics-overview.use-case';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly getStatisticsOverviewUseCase: GetStatisticsOverviewUseCase,
  ) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get general documentation statistics',
    description:
      'Returns completion percentage, most pending documents and latest submissions.',
  })
  @ApiOkResponse({
    type: StatisticsOverviewOutputDto,
    description: 'Statistics overview generated successfully.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in query params.',
  })
  async getOverview(
    @Query() query: StatisticsOverviewQueryDto,
  ): Promise<StatisticsOverviewOutputDto> {
    return this.getStatisticsOverviewUseCase.execute(query);
  }
}

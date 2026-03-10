import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class StatisticsOverviewQueryDto {
  @ApiPropertyOptional({
    example: 5,
    default: 5,
    description: 'Limit for most pending document types list.',
  })
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? 5 : Number(value),
  )
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  topPendingLimit: number = 5;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Limit for latest submissions list.',
  })
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? 10 : Number(value),
  )
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  latestSubmissionsLimit: number = 10;
}

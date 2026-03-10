import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  LatestSubmissionDto,
  MostPendingDocumentDto,
  StatisticsOverviewOutputDto,
} from '../dtos/statistics-overview-output.dto';
import { StatisticsOverviewQueryDto } from '../dtos/statistics-overview-query.dto';
import { AbstractStatisticsRepository } from './statistics.repository.abstract';

@Injectable()
export class StatisticsRepository implements AbstractStatisticsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getOverview(
    query: StatisticsOverviewQueryDto,
  ): Promise<StatisticsOverviewOutputDto> {
    const requiredRows = (await this.dataSource.query(
      `
        SELECT COUNT(*)::int AS total
        FROM employee_document_types
        WHERE deleted_at IS NULL
      `,
    )) as unknown as Array<{ total: number }>;

    const pendingRows = (await this.dataSource.query(
      `
        SELECT COUNT(*)::int AS total
        FROM pending_documents
        WHERE deleted_at IS NULL
      `,
    )) as unknown as Array<{ total: number }>;

    const totalRequired = Number(requiredRows[0]?.total ?? 0);
    const totalPending = Number(pendingRows[0]?.total ?? 0);
    const totalCompleted = Math.max(totalRequired - totalPending, 0);

    const documentationCompletePercentage =
      totalRequired === 0
        ? 100
        : Number(((totalCompleted / totalRequired) * 100).toFixed(2));

    const mostPendingRows = (await this.dataSource.query(
      `
        SELECT
          p.document_type_id AS "documentTypeId",
          dt.name AS "documentTypeName",
          COUNT(*)::int AS "pendingCount"
        FROM pending_documents p
        INNER JOIN document_types dt ON dt.id = p.document_type_id
        WHERE p.deleted_at IS NULL
          AND dt.deleted_at IS NULL
        GROUP BY p.document_type_id, dt.name
        ORDER BY "pendingCount" DESC, dt.name ASC
        LIMIT $1
      `,
      [query.topPendingLimit],
    )) as unknown as MostPendingDocumentDto[];

    const latestSubmissionRows = (await this.dataSource.query(
      `
        SELECT
          ds.id AS "submissionId",
          ds.employee_id AS "employeeId",
          e.name AS "employeeName",
          ds.document_type_id AS "documentTypeId",
          dt.name AS "documentTypeName",
          ds.version AS "version",
          ds.submitted_at AS "submittedAt"
        FROM document_submissions ds
        INNER JOIN employees e ON e.id = ds.employee_id
        INNER JOIN document_types dt ON dt.id = ds.document_type_id
        WHERE ds.deleted_at IS NULL
          AND e.deleted_at IS NULL
          AND dt.deleted_at IS NULL
        ORDER BY ds.submitted_at DESC
        LIMIT $1
      `,
      [query.latestSubmissionsLimit],
    )) as unknown as LatestSubmissionDto[];

    return {
      documentationCompletePercentage,
      mostPendingDocuments: mostPendingRows,
      latestSubmissions: latestSubmissionRows,
    };
  }
}

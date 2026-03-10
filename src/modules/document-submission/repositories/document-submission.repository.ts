import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateDocumentSubmissionDto } from '../dtos/create-document-submission.dto';
import { ListPendingDocumentsQueryDto } from '../dtos/list-pending-documents-query.dto';
import { PendingDocumentOutputDto } from '../dtos/pending-document-output.dto';
import { DocumentSubmissionEntity } from '../entities/document-submission.entity';
import { AbstractDocumentSubmissionRepository } from './document-submission.repository.abstract';

@Injectable()
export class DocumentSubmissionRepository implements AbstractDocumentSubmissionRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createNewVersion(
    createDocumentSubmissionDto: CreateDocumentSubmissionDto,
  ): Promise<DocumentSubmissionEntity> {
    return this.dataSource.transaction(async (manager) => {
      const currentVersion = await manager.findOne(DocumentSubmissionEntity, {
        where: {
          employeeId: createDocumentSubmissionDto.employeeId,
          documentTypeId: createDocumentSubmissionDto.documentTypeId,
          isCurrent: true,
        },
        order: { version: 'DESC' },
      });

      if (currentVersion) {
        await manager.update(
          DocumentSubmissionEntity,
          { id: currentVersion.id },
          { isCurrent: false },
        );
      }

      const submission = manager.create(DocumentSubmissionEntity, {
        employeeId: createDocumentSubmissionDto.employeeId,
        documentTypeId: createDocumentSubmissionDto.documentTypeId,
        fileName: createDocumentSubmissionDto.fileName,
        fileReference: createDocumentSubmissionDto.fileReference,
        version: (currentVersion?.version ?? 0) + 1,
        isCurrent: true,
        submittedAt: new Date(),
        deletedAt: null,
      });

      return manager.save(submission);
    });
  }

  async findPendingDocuments(
    query: ListPendingDocumentsQueryDto,
  ): Promise<{ items: PendingDocumentOutputDto[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset = (page - 1) * limit;

    const params: Array<string | number> = [];
    let whereClause = `
      e.deleted_at IS NULL
      AND dt.deleted_at IS NULL
      AND ds.id IS NULL
    `;

    if (query.employeeId) {
      params.push(query.employeeId);
      whereClause += ` AND e.id = $${params.length}`;
    }

    if (query.employeeName) {
      params.push(`%${query.employeeName}%`);
      whereClause += ` AND e.name ILIKE $${params.length}`;
    }

    if (query.documentTypeId) {
      params.push(query.documentTypeId);
      whereClause += ` AND dt.id = $${params.length}`;
    }

    if (query.documentTypeName) {
      params.push(`%${query.documentTypeName}%`);
      whereClause += ` AND dt.name ILIKE $${params.length}`;
    }

    const baseFromClause = `
      FROM employees e
      CROSS JOIN document_types dt
      LEFT JOIN document_submissions ds
        ON ds.employee_id = e.id
        AND ds.document_type_id = dt.id
        AND ds.is_current = true
        AND ds.deleted_at IS NULL
      WHERE ${whereClause}
    `;

    const totalRows = (await this.dataSource.query(
      `SELECT COUNT(*)::int AS total ${baseFromClause}`,
      params,
    )) as unknown as Array<{ total: number }>;
    const total: number = Number(totalRows[0]?.total ?? 0);

    params.push(limit, offset);

    const rows = (await this.dataSource.query(
      `
        SELECT
          e.id AS "employeeId",
          e.name AS "employeeName",
          dt.id AS "documentTypeId",
          dt.name AS "documentTypeName",
          e.created_at AS "pendingSince"
        ${baseFromClause}
        ORDER BY e.name ASC, dt.name ASC
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
      `,
      params,
    )) as unknown as PendingDocumentOutputDto[];

    return {
      items: rows,
      total,
    };
  }
}

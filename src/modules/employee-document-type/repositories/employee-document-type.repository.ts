import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, IsNull, Repository } from 'typeorm';
import { DocumentSubmissionEntity } from '../../document-submission/entities/document-submission.entity';
import { EmployeeDocumentTypeEntity } from '../entities/employee-document-type.entity';
import { PendingDocumentEntity } from '../entities/pending-document.entity';
import { AbstractEmployeeDocumentTypeRepository } from './employee-document-type.repository.abstract';

@Injectable()
export class EmployeeDocumentTypeRepository implements AbstractEmployeeDocumentTypeRepository {
  constructor(
    @InjectRepository(EmployeeDocumentTypeEntity)
    private readonly repository: Repository<EmployeeDocumentTypeEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findOne(
    options: FindOneOptions<EmployeeDocumentTypeEntity>,
  ): Promise<EmployeeDocumentTypeEntity | null> {
    return this.repository.findOne(options);
  }

  async linkWithPendingAtomic(
    employeeId: string,
    documentTypeId: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const existingLink = await manager.findOne(EmployeeDocumentTypeEntity, {
        where: { employeeId, documentTypeId },
        withDeleted: true,
      });

      if (!existingLink) {
        const newLink = manager.create(EmployeeDocumentTypeEntity, {
          employeeId,
          documentTypeId,
          linkedAt: new Date(),
          deletedAt: null,
        });

        await manager.save(newLink);
      } else if (existingLink.deletedAt) {
        await manager.restore(EmployeeDocumentTypeEntity, {
          id: existingLink.id,
        });
        await manager.update(
          EmployeeDocumentTypeEntity,
          { id: existingLink.id },
          { linkedAt: new Date() },
        );
      }

      const currentSubmission = await manager.findOne(
        DocumentSubmissionEntity,
        {
          where: {
            employeeId,
            documentTypeId,
            isCurrent: true,
            deletedAt: IsNull(),
          },
        },
      );

      if (currentSubmission) {
        await manager.softDelete(PendingDocumentEntity, {
          employeeId,
          documentTypeId,
          deletedAt: IsNull(),
        });
        return;
      }

      const existingPending = await manager.findOne(PendingDocumentEntity, {
        where: { employeeId, documentTypeId },
        withDeleted: true,
      });

      if (!existingPending) {
        const pending = manager.create(PendingDocumentEntity, {
          employeeId,
          documentTypeId,
          pendingSince: new Date(),
          deletedAt: null,
        });
        await manager.save(pending);
      } else if (existingPending.deletedAt) {
        await manager.restore(PendingDocumentEntity, {
          id: existingPending.id,
        });
        await manager.update(
          PendingDocumentEntity,
          { id: existingPending.id },
          { pendingSince: new Date() },
        );
      }
    });
  }

  async unlinkWithPendingAtomic(
    employeeId: string,
    documentTypeId: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.softDelete(EmployeeDocumentTypeEntity, {
        employeeId,
        documentTypeId,
        deletedAt: IsNull(),
      });

      await manager.softDelete(PendingDocumentEntity, {
        employeeId,
        documentTypeId,
        deletedAt: IsNull(),
      });
    });
  }
}

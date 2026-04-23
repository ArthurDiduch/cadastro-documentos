import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypePersistenceModule } from '../document-type/document-type-persistence.module';
import { EmployeePersistenceModule } from '../employee/employee-persistence.module';
import { DocumentSubmissionController } from './controllers/document-submission.controller';
import { DocumentSubmissionEntity } from './entities/document-submission.entity';
import { DocumentSubmissionRepository } from './repositories/document-submission.repository';
import { AbstractDocumentSubmissionRepository } from './repositories/document-submission.repository.abstract';
import { ListPendingDocumentsUseCase } from './use-cases/list-pending-documents.use-case';
import { SubmitDocumentUseCase } from './use-cases/submit-document.use-case';

@Module({
  imports: [
    EmployeePersistenceModule,
    DocumentTypePersistenceModule,
    TypeOrmModule.forFeature([DocumentSubmissionEntity]),
  ],
  controllers: [DocumentSubmissionController],
  providers: [
    {
      provide: AbstractDocumentSubmissionRepository,
      useClass: DocumentSubmissionRepository,
    },
    SubmitDocumentUseCase,
    ListPendingDocumentsUseCase,
  ],
})
export class DocumentSubmissionModule {}

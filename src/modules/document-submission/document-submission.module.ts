import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeEntity } from '../document-type/entities/document-type.entity';
import { DocumentTypeRepository } from '../document-type/repositories/document-type.repository';
import { AbstractDocumentTypeRepository } from '../document-type/repositories/document-type.repository.abstract';
import { EmployeeEntity } from '../employee/entities/employee.entity';
import { EmployeeRepository } from '../employee/repositories/employee.repository';
import { AbstractEmployeeRepository } from '../employee/repositories/employee.repository.abstract';
import { DocumentSubmissionController } from './controllers/document-submission.controller';
import { DocumentSubmissionEntity } from './entities/document-submission.entity';
import { DocumentSubmissionRepository } from './repositories/document-submission.repository';
import { AbstractDocumentSubmissionRepository } from './repositories/document-submission.repository.abstract';
import { ListPendingDocumentsUseCase } from './use-cases/list-pending-documents.use-case';
import { SubmitDocumentUseCase } from './use-cases/submit-document.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentSubmissionEntity,
      EmployeeEntity,
      DocumentTypeEntity,
    ]),
  ],
  controllers: [DocumentSubmissionController],
  providers: [
    {
      provide: AbstractEmployeeRepository,
      useClass: EmployeeRepository,
    },
    {
      provide: AbstractDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
    {
      provide: AbstractDocumentSubmissionRepository,
      useClass: DocumentSubmissionRepository,
    },
    SubmitDocumentUseCase,
    ListPendingDocumentsUseCase,
  ],
})
export class DocumentSubmissionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentSubmissionEntity } from '../document-submission/entities/document-submission.entity';
import { DocumentTypeEntity } from '../document-type/entities/document-type.entity';
import { DocumentTypePersistenceModule } from '../document-type/document-type-persistence.module';
import { EmployeeEntity } from '../employee/entities/employee.entity';
import { EmployeePersistenceModule } from '../employee/employee-persistence.module';
import { EmployeeDocumentTypeController } from './controllers/employee-document-type.controller';
import { EmployeeDocumentTypeEntity } from './entities/employee-document-type.entity';
import { PendingDocumentEntity } from './entities/pending-document.entity';
import { EmployeeDocumentTypeRepository } from './repositories/employee-document-type.repository';
import { AbstractEmployeeDocumentTypeRepository } from './repositories/employee-document-type.repository.abstract';
import { LinkEmployeeDocumentTypeUseCase } from './use-cases/link-employee-document-type.use-case';
import { UnlinkEmployeeDocumentTypeUseCase } from './use-cases/unlink-employee-document-type.use-case';

@Module({
  imports: [
    EmployeePersistenceModule,
    DocumentTypePersistenceModule,
    TypeOrmModule.forFeature([
      EmployeeDocumentTypeEntity,
      PendingDocumentEntity,
      EmployeeEntity,
      DocumentTypeEntity,
      DocumentSubmissionEntity,
    ]),
  ],
  controllers: [EmployeeDocumentTypeController],
  providers: [
    {
      provide: AbstractEmployeeDocumentTypeRepository,
      useClass: EmployeeDocumentTypeRepository,
    },
    LinkEmployeeDocumentTypeUseCase,
    UnlinkEmployeeDocumentTypeUseCase,
  ],
})
export class EmployeeDocumentTypeModule {}

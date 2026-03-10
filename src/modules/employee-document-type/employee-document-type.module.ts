import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentSubmissionEntity } from '../document-submission/entities/document-submission.entity';
import { DocumentTypeEntity } from '../document-type/entities/document-type.entity';
import { DocumentTypeRepository } from '../document-type/repositories/document-type.repository';
import { AbstractDocumentTypeRepository } from '../document-type/repositories/document-type.repository.abstract';
import { EmployeeEntity } from '../employee/entities/employee.entity';
import { EmployeeRepository } from '../employee/repositories/employee.repository';
import { AbstractEmployeeRepository } from '../employee/repositories/employee.repository.abstract';
import { EmployeeDocumentTypeController } from './controllers/employee-document-type.controller';
import { EmployeeDocumentTypeEntity } from './entities/employee-document-type.entity';
import { PendingDocumentEntity } from './entities/pending-document.entity';
import { EmployeeDocumentTypeRepository } from './repositories/employee-document-type.repository';
import { AbstractEmployeeDocumentTypeRepository } from './repositories/employee-document-type.repository.abstract';
import { LinkEmployeeDocumentTypeUseCase } from './use-cases/link-employee-document-type.use-case';
import { UnlinkEmployeeDocumentTypeUseCase } from './use-cases/unlink-employee-document-type.use-case';

@Module({
  imports: [
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
      provide: AbstractEmployeeRepository,
      useClass: EmployeeRepository,
    },
    {
      provide: AbstractDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
    {
      provide: AbstractEmployeeDocumentTypeRepository,
      useClass: EmployeeDocumentTypeRepository,
    },
    LinkEmployeeDocumentTypeUseCase,
    UnlinkEmployeeDocumentTypeUseCase,
  ],
})
export class EmployeeDocumentTypeModule {}

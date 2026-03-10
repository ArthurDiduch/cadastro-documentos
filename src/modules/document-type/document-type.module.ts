import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeController } from './controllers/document-type.controller';
import { DocumentTypeEntity } from './entities/document-type.entity';
import { DocumentTypeRepository } from './repositories/document-type.repository';
import { AbstractDocumentTypeRepository } from './repositories/document-type.repository.abstract';
import { FindDocumentTypeByIdUseCase } from './use-cases/find-document-type-by-id.use-case';
import { ListDocumentTypesUseCase } from './use-cases/list-document-types.use-case';
import { ReactivateDocumentTypeUseCase } from './use-cases/reactivate-document-type.use-case';
import { RegisterDocumentTypeUseCase } from './use-cases/register-document-type.use-case';
import { SoftDeleteDocumentTypeUseCase } from './use-cases/soft-delete-document-type.use-case';
import { UpdateDocumentTypeUseCase } from './use-cases/update-document-type.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTypeEntity])],
  controllers: [DocumentTypeController],
  providers: [
    {
      provide: AbstractDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
    RegisterDocumentTypeUseCase,
    FindDocumentTypeByIdUseCase,
    ListDocumentTypesUseCase,
    UpdateDocumentTypeUseCase,
    SoftDeleteDocumentTypeUseCase,
    ReactivateDocumentTypeUseCase,
  ],
})
export class DocumentTypeModule {}

import { Module } from '@nestjs/common';
import { DocumentTypeController } from './controllers/document-type.controller';
import { DocumentTypePersistenceModule } from './document-type-persistence.module';
import { FindDocumentTypeByIdUseCase } from './use-cases/find-document-type-by-id.use-case';
import { ListDocumentTypesUseCase } from './use-cases/list-document-types.use-case';
import { ReactivateDocumentTypeUseCase } from './use-cases/reactivate-document-type.use-case';
import { RegisterDocumentTypeUseCase } from './use-cases/register-document-type.use-case';
import { SoftDeleteDocumentTypeUseCase } from './use-cases/soft-delete-document-type.use-case';
import { UpdateDocumentTypeUseCase } from './use-cases/update-document-type.use-case';

@Module({
  imports: [DocumentTypePersistenceModule],
  controllers: [DocumentTypeController],
  providers: [
    RegisterDocumentTypeUseCase,
    FindDocumentTypeByIdUseCase,
    ListDocumentTypesUseCase,
    UpdateDocumentTypeUseCase,
    SoftDeleteDocumentTypeUseCase,
    ReactivateDocumentTypeUseCase,
  ],
})
export class DocumentTypeModule {}

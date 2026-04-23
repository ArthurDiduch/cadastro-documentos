import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeEntity } from './entities/document-type.entity';
import { DocumentTypeRepository } from './repositories/document-type.repository';
import { AbstractDocumentTypeRepository } from './repositories/document-type.repository.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentTypeEntity])],
  providers: [
    {
      provide: AbstractDocumentTypeRepository,
      useClass: DocumentTypeRepository,
    },
  ],
  exports: [AbstractDocumentTypeRepository],
})
export class DocumentTypePersistenceModule {}

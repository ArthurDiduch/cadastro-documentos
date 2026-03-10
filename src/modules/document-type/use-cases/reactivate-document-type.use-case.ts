import { Injectable } from '@nestjs/common';
import { DocumentTypeOutputDto } from '../dtos/document-type-output.dto';
import { DocumentTypeNameAlreadyExistsError } from '../errors/document-type-name-already-exists.error';
import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';

@Injectable()
export class ReactivateDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<DocumentTypeOutputDto> {
    const documentType = await this.documentTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!documentType) {
      throw DocumentTypeNotFoundError.create(id);
    }

    if (!documentType.deletedAt) {
      return DocumentTypeOutputDto.fromDocumentType(documentType);
    }

    const existingByName = await this.documentTypeRepository.findOne({
      where: { name: documentType.name },
    });

    if (existingByName && existingByName.id !== id) {
      throw DocumentTypeNameAlreadyExistsError.create();
    }

    await this.documentTypeRepository.restore({ id });

    const restoredDocumentType = await this.documentTypeRepository.findOne({
      where: { id },
    });

    if (!restoredDocumentType) {
      throw DocumentTypeNotFoundError.create(id);
    }

    return DocumentTypeOutputDto.fromDocumentType(restoredDocumentType);
  }
}

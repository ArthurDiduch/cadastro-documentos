import { Injectable } from '@nestjs/common';
import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';

@Injectable()
export class SoftDeleteDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const documentType = await this.documentTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!documentType) {
      throw DocumentTypeNotFoundError.create(id);
    }

    if (documentType.deletedAt) {
      return;
    }

    await this.documentTypeRepository.softDelete({ id });
  }
}

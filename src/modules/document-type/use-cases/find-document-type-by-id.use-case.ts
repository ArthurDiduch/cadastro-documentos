import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { DocumentTypeOutputDto } from '../dtos/document-type-output.dto';
import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';

@Injectable()
export class FindDocumentTypeByIdUseCase {
  constructor(
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(
    id: string,
    includeInactive: boolean = false,
  ): Promise<DocumentTypeOutputDto> {
    const documentType = await this.documentTypeRepository.findOne({
      where: includeInactive ? { id } : { id, deletedAt: IsNull() },
      withDeleted: includeInactive,
    });

    if (!documentType) {
      throw DocumentTypeNotFoundError.create(id);
    }

    return DocumentTypeOutputDto.fromDocumentType(documentType);
  }
}

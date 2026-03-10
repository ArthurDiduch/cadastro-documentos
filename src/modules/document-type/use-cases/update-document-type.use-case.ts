import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { DocumentTypeOutputDto } from '../dtos/document-type-output.dto';
import { UpdateDocumentTypeDto } from '../dtos/update-document-type.dto';
import { DocumentTypeNameAlreadyExistsError } from '../errors/document-type-name-already-exists.error';
import { DocumentTypeNotFoundError } from '../errors/document-type-not-found.error';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';

@Injectable()
export class UpdateDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(
    id: string,
    updateDocumentTypeDto: UpdateDocumentTypeDto,
  ): Promise<DocumentTypeOutputDto> {
    const currentDocumentType = await this.documentTypeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!currentDocumentType) {
      throw DocumentTypeNotFoundError.create(id);
    }

    if (
      updateDocumentTypeDto.name &&
      updateDocumentTypeDto.name !== currentDocumentType.name
    ) {
      const existingByName = await this.documentTypeRepository.findOne({
        where: { name: updateDocumentTypeDto.name },
        withDeleted: true,
      });

      if (existingByName && existingByName.id !== id) {
        throw DocumentTypeNameAlreadyExistsError.create();
      }
    }

    await this.documentTypeRepository.update({ id }, updateDocumentTypeDto);

    const updatedDocumentType = await this.documentTypeRepository.findOne({
      where: { id },
    });

    if (!updatedDocumentType) {
      throw DocumentTypeNotFoundError.create(id);
    }

    return DocumentTypeOutputDto.fromDocumentType(updatedDocumentType);
  }
}

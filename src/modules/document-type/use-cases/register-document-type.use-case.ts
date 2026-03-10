import { Injectable } from '@nestjs/common';
import { CreateDocumentTypeDto } from '../dtos/create-document-type.dto';
import { RegisterDocumentTypeOutputDto } from '../dtos/register-document-type-output.dto';
import { DocumentTypeNameAlreadyExistsError } from '../errors/document-type-name-already-exists.error';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';

@Injectable()
export class RegisterDocumentTypeUseCase {
  constructor(
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(
    createDocumentTypeDto: CreateDocumentTypeDto,
  ): Promise<RegisterDocumentTypeOutputDto> {
    const existingByName = await this.documentTypeRepository.findOne({
      where: { name: createDocumentTypeDto.name },
      withDeleted: true,
    });

    if (existingByName) {
      throw DocumentTypeNameAlreadyExistsError.create();
    }

    const documentType = this.documentTypeRepository.create({
      ...createDocumentTypeDto,
      deletedAt: null,
    });
    const persistedDocumentType =
      await this.documentTypeRepository.save(documentType);

    return RegisterDocumentTypeOutputDto.fromDocumentType(
      persistedDocumentType,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { ILike, IsNull, Not } from 'typeorm';
import { DocumentTypeOutputDto } from '../dtos/document-type-output.dto';
import { ListDocumentTypesQueryDto } from '../dtos/list-document-types-query.dto';
import { PaginatedDocumentTypesOutputDto } from '../dtos/paginated-document-types-output.dto';
import { AbstractDocumentTypeRepository } from '../repositories/document-type.repository.abstract';

@Injectable()
export class ListDocumentTypesUseCase {
  constructor(
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(
    query: ListDocumentTypesQueryDto,
  ): Promise<PaginatedDocumentTypesOutputDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.name ? { name: ILike(`%${query.name}%`) } : {}),
      ...(query.isActive === true
        ? { deletedAt: IsNull() }
        : query.isActive === false
          ? { deletedAt: Not(IsNull()) }
          : {}),
    };

    const [documentTypes, total] =
      await this.documentTypeRepository.findAndCount({
        where,
        withDeleted: query.isActive !== true,
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });

    return {
      items: documentTypes.map((documentType) =>
        DocumentTypeOutputDto.fromDocumentType(documentType),
      ),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

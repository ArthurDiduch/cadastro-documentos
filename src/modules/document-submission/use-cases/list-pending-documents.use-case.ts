import { Injectable } from '@nestjs/common';
import { ListPendingDocumentsQueryDto } from '../dtos/list-pending-documents-query.dto';
import { PaginatedPendingDocumentsOutputDto } from '../dtos/paginated-pending-documents-output.dto';
import { AbstractDocumentSubmissionRepository } from '../repositories/document-submission.repository.abstract';

@Injectable()
export class ListPendingDocumentsUseCase {
  constructor(
    private readonly documentSubmissionRepository: AbstractDocumentSubmissionRepository,
  ) {}

  async execute(
    query: ListPendingDocumentsQueryDto,
  ): Promise<PaginatedPendingDocumentsOutputDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, total } =
      await this.documentSubmissionRepository.findPendingDocuments(query);

    return {
      items,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

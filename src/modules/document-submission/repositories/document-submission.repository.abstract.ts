import { CreateDocumentSubmissionDto } from '../dtos/create-document-submission.dto';
import { ListPendingDocumentsQueryDto } from '../dtos/list-pending-documents-query.dto';
import { PendingDocumentOutputDto } from '../dtos/pending-document-output.dto';
import { DocumentSubmissionEntity } from '../entities/document-submission.entity';

export abstract class AbstractDocumentSubmissionRepository {
  abstract createNewVersion(
    createDocumentSubmissionDto: CreateDocumentSubmissionDto,
  ): Promise<DocumentSubmissionEntity>;

  abstract findPendingDocuments(
    query: ListPendingDocumentsQueryDto,
  ): Promise<{ items: PendingDocumentOutputDto[]; total: number }>;
}

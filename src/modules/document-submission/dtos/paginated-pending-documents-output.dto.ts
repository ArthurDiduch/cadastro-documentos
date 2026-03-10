import { PaginatedOutputDto } from 'src/shared/dtos/paginated-output.dto';
import { PendingDocumentOutputDto } from './pending-document-output.dto';

export class PaginatedPendingDocumentsOutputDto extends PaginatedOutputDto(
  PendingDocumentOutputDto,
) {}

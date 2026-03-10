import { PaginatedOutputDto } from 'src/shared/dtos/paginated-output.dto';
import { DocumentTypeOutputDto } from './document-type-output.dto';

export class PaginatedDocumentTypesOutputDto extends PaginatedOutputDto(
  DocumentTypeOutputDto,
) {}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/shared/dtos/error-response.dto';
import { ValidationErrorResponseDto } from 'src/shared/dtos/validation-error-response.dto';
import { CreateDocumentSubmissionDto } from '../dtos/create-document-submission.dto';
import { DocumentSubmissionOutputDto } from '../dtos/document-submission-output.dto';
import { ListPendingDocumentsQueryDto } from '../dtos/list-pending-documents-query.dto';
import { PaginatedPendingDocumentsOutputDto } from '../dtos/paginated-pending-documents-output.dto';
import { ListPendingDocumentsUseCase } from '../use-cases/list-pending-documents.use-case';
import { SubmitDocumentUseCase } from '../use-cases/submit-document.use-case';

@ApiTags('Document Submissions')
@Controller('document-submissions')
export class DocumentSubmissionController {
  constructor(
    private readonly submitDocumentUseCase: SubmitDocumentUseCase,
    private readonly listPendingDocumentsUseCase: ListPendingDocumentsUseCase,
  ) {}

  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List pending documents with pagination and filters',
    description:
      'Lists employee-document type combinations without current submitted document.',
  })
  @ApiOkResponse({
    type: PaginatedPendingDocumentsOutputDto,
    description: 'Pending documents paginated list.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in query params.',
  })
  async getPending(
    @Query() query: ListPendingDocumentsQueryDto,
  ): Promise<PaginatedPendingDocumentsOutputDto> {
    return this.listPendingDocumentsUseCase.execute(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit document (logical upload)',
    description:
      'Creates a new document submission version for employee and document type.',
  })
  @ApiCreatedResponse({
    type: DocumentSubmissionOutputDto,
    description: 'Document submitted successfully.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee or document type not found.',
  })
  async submit(
    @Body() createDocumentSubmissionDto: CreateDocumentSubmissionDto,
  ): Promise<DocumentSubmissionOutputDto> {
    return this.submitDocumentUseCase.execute(createDocumentSubmissionDto);
  }
}

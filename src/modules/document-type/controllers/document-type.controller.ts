import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/shared/dtos/error-response.dto';
import { ValidationErrorResponseDto } from 'src/shared/dtos/validation-error-response.dto';
import { CreateDocumentTypeDto } from '../dtos/create-document-type.dto';
import { DocumentTypeOutputDto } from '../dtos/document-type-output.dto';
import { ListDocumentTypesQueryDto } from '../dtos/list-document-types-query.dto';
import { PaginatedDocumentTypesOutputDto } from '../dtos/paginated-document-types-output.dto';
import { RegisterDocumentTypeOutputDto } from '../dtos/register-document-type-output.dto';
import { UpdateDocumentTypeDto } from '../dtos/update-document-type.dto';
import { FindDocumentTypeByIdUseCase } from '../use-cases/find-document-type-by-id.use-case';
import { ListDocumentTypesUseCase } from '../use-cases/list-document-types.use-case';
import { ReactivateDocumentTypeUseCase } from '../use-cases/reactivate-document-type.use-case';
import { RegisterDocumentTypeUseCase } from '../use-cases/register-document-type.use-case';
import { SoftDeleteDocumentTypeUseCase } from '../use-cases/soft-delete-document-type.use-case';
import { UpdateDocumentTypeUseCase } from '../use-cases/update-document-type.use-case';

@ApiTags('Document Types')
@Controller('document-types')
export class DocumentTypeController {
  constructor(
    private readonly registerDocumentTypeUseCase: RegisterDocumentTypeUseCase,
    private readonly findDocumentTypeByIdUseCase: FindDocumentTypeByIdUseCase,
    private readonly listDocumentTypesUseCase: ListDocumentTypesUseCase,
    private readonly updateDocumentTypeUseCase: UpdateDocumentTypeUseCase,
    private readonly softDeleteDocumentTypeUseCase: SoftDeleteDocumentTypeUseCase,
    private readonly reactivateDocumentTypeUseCase: ReactivateDocumentTypeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register document type',
    description: 'Creates a new document type when name is unique.',
  })
  @ApiCreatedResponse({
    type: RegisterDocumentTypeOutputDto,
    description: 'Document type registered successfully.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Document type name already exists.',
  })
  async register(
    @Body() createDocumentTypeDto: CreateDocumentTypeDto,
  ): Promise<RegisterDocumentTypeOutputDto> {
    return this.registerDocumentTypeUseCase.execute(createDocumentTypeDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get document type by id' })
  @ApiParam({ name: 'id', description: 'Document type id (UUID).' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'When true, allows returning soft-deleted document types.',
  })
  @ApiOkResponse({
    type: DocumentTypeOutputDto,
    description: 'Document type found.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Document type not found.',
  })
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<DocumentTypeOutputDto> {
    return this.findDocumentTypeByIdUseCase.execute(
      id,
      includeInactive === 'true',
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List document types with pagination and filters' })
  @ApiOkResponse({
    type: PaginatedDocumentTypesOutputDto,
    description: 'Document types paginated list.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  async getPaginated(
    @Query() query: ListDocumentTypesQueryDto,
  ): Promise<PaginatedDocumentTypesOutputDto> {
    return this.listDocumentTypesUseCase.execute(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update active document type' })
  @ApiParam({ name: 'id', description: 'Document type id (UUID).' })
  @ApiOkResponse({
    type: DocumentTypeOutputDto,
    description: 'Document type updated.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Document type not found.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Document type name already exists.',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ): Promise<DocumentTypeOutputDto> {
    return this.updateDocumentTypeUseCase.execute(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete document type' })
  @ApiParam({ name: 'id', description: 'Document type id (UUID).' })
  @ApiNoContentResponse({ description: 'Document type soft deleted.' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Document type not found.',
  })
  async softDelete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.softDeleteDocumentTypeUseCase.execute(id);
  }

  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate soft-deleted document type' })
  @ApiParam({ name: 'id', description: 'Document type id (UUID).' })
  @ApiOkResponse({
    type: DocumentTypeOutputDto,
    description: 'Document type active again.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Document type not found.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Document type name already exists.',
  })
  async reactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DocumentTypeOutputDto> {
    return this.reactivateDocumentTypeUseCase.execute(id);
  }
}

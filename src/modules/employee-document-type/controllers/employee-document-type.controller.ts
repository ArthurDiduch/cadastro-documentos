import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/shared/dtos/error-response.dto';
import { ValidationErrorResponseDto } from 'src/shared/dtos/validation-error-response.dto';
import { LinkEmployeeDocumentTypeDto } from '../dtos/link-employee-document-type.dto';
import { LinkEmployeeDocumentTypeUseCase } from '../use-cases/link-employee-document-type.use-case';
import { UnlinkEmployeeDocumentTypeUseCase } from '../use-cases/unlink-employee-document-type.use-case';

@ApiTags('Employee Document Types')
@Controller('employee-document-types')
export class EmployeeDocumentTypeController {
  constructor(
    private readonly linkEmployeeDocumentTypeUseCase: LinkEmployeeDocumentTypeUseCase,
    private readonly unlinkEmployeeDocumentTypeUseCase: UnlinkEmployeeDocumentTypeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Link employee to document type',
    description: 'Atomically links and creates pending document when needed.',
  })
  @ApiNoContentResponse({
    description: 'Employee linked to document type successfully.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee or document type not found.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Employee is already linked to this document type.',
  })
  async link(@Body() linkDto: LinkEmployeeDocumentTypeDto): Promise<void> {
    await this.linkEmployeeDocumentTypeUseCase.execute(linkDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Unlink employee from document type',
    description: 'Atomically unlinks and closes pending document.',
  })
  @ApiNoContentResponse({
    description: 'Employee unlinked from document type successfully.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee-document type link not found.',
  })
  async unlink(@Body() linkDto: LinkEmployeeDocumentTypeDto): Promise<void> {
    await this.unlinkEmployeeDocumentTypeUseCase.execute(linkDto);
  }
}

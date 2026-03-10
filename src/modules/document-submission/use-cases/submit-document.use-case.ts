import { Injectable } from '@nestjs/common';
import { AbstractDocumentTypeRepository } from 'src/modules/document-type/repositories/document-type.repository.abstract';
import { EmployeeNotFoundError } from 'src/modules/employee/errors/employee-not-found.error';
import { AbstractEmployeeRepository } from 'src/modules/employee/repositories/employee.repository.abstract';
import { IsNull } from 'typeorm';
import { DocumentTypeNotFoundError } from '../../document-type/errors/document-type-not-found.error';
import { CreateDocumentSubmissionDto } from '../dtos/create-document-submission.dto';
import { DocumentSubmissionOutputDto } from '../dtos/document-submission-output.dto';
import { AbstractDocumentSubmissionRepository } from '../repositories/document-submission.repository.abstract';

@Injectable()
export class SubmitDocumentUseCase {
  constructor(
    private readonly documentSubmissionRepository: AbstractDocumentSubmissionRepository,
    private readonly employeeRepository: AbstractEmployeeRepository,
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
  ) {}

  async execute(
    createDocumentSubmissionDto: CreateDocumentSubmissionDto,
  ): Promise<DocumentSubmissionOutputDto> {
    const [employee, documentType] = await Promise.all([
      this.employeeRepository.findOne({
        where: {
          id: createDocumentSubmissionDto.employeeId,
          deletedAt: IsNull(),
        },
      }),
      this.documentTypeRepository.findOne({
        where: {
          id: createDocumentSubmissionDto.documentTypeId,
          deletedAt: IsNull(),
        },
      }),
    ]);

    if (!employee) {
      throw EmployeeNotFoundError.create(
        createDocumentSubmissionDto.employeeId,
      );
    }

    if (!documentType) {
      throw DocumentTypeNotFoundError.create(
        createDocumentSubmissionDto.documentTypeId,
      );
    }

    const submission = await this.documentSubmissionRepository.createNewVersion(
      createDocumentSubmissionDto,
    );

    return DocumentSubmissionOutputDto.fromDocumentSubmission(submission);
  }
}

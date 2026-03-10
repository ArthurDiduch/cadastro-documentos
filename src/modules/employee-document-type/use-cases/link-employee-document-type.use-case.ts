import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { DocumentTypeNotFoundError } from '../../document-type/errors/document-type-not-found.error';
import { AbstractDocumentTypeRepository } from '../../document-type/repositories/document-type.repository.abstract';
import { EmployeeNotFoundError } from '../../employee/errors/employee-not-found.error';
import { AbstractEmployeeRepository } from '../../employee/repositories/employee.repository.abstract';
import { LinkEmployeeDocumentTypeDto } from '../dtos/link-employee-document-type.dto';
import { EmployeeDocumentTypeAlreadyLinkedError } from '../errors/employee-document-type-already-linked.error';
import { AbstractEmployeeDocumentTypeRepository } from '../repositories/employee-document-type.repository.abstract';

@Injectable()
export class LinkEmployeeDocumentTypeUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
    private readonly documentTypeRepository: AbstractDocumentTypeRepository,
    private readonly employeeDocumentTypeRepository: AbstractEmployeeDocumentTypeRepository,
  ) {}

  async execute(linkDto: LinkEmployeeDocumentTypeDto): Promise<void> {
    const [employee, documentType, existingLink] = await Promise.all([
      this.employeeRepository.findOne({
        where: { id: linkDto.employeeId, deletedAt: IsNull() },
      }),
      this.documentTypeRepository.findOne({
        where: { id: linkDto.documentTypeId, deletedAt: IsNull() },
      }),
      this.employeeDocumentTypeRepository.findOne({
        where: {
          employeeId: linkDto.employeeId,
          documentTypeId: linkDto.documentTypeId,
          deletedAt: IsNull(),
        },
      }),
    ]);

    if (!employee) {
      throw EmployeeNotFoundError.create(linkDto.employeeId);
    }

    if (!documentType) {
      throw DocumentTypeNotFoundError.create(linkDto.documentTypeId);
    }

    if (existingLink) {
      throw EmployeeDocumentTypeAlreadyLinkedError.create();
    }

    await this.employeeDocumentTypeRepository.linkWithPendingAtomic(
      linkDto.employeeId,
      linkDto.documentTypeId,
    );
  }
}

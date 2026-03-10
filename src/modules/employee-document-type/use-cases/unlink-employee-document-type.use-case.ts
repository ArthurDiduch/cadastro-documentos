import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { LinkEmployeeDocumentTypeDto } from '../dtos/link-employee-document-type.dto';
import { EmployeeDocumentTypeLinkNotFoundError } from '../errors/employee-document-type-link-not-found.error';
import { AbstractEmployeeDocumentTypeRepository } from '../repositories/employee-document-type.repository.abstract';

@Injectable()
export class UnlinkEmployeeDocumentTypeUseCase {
  constructor(
    private readonly employeeDocumentTypeRepository: AbstractEmployeeDocumentTypeRepository,
  ) {}

  async execute(linkDto: LinkEmployeeDocumentTypeDto): Promise<void> {
    const existingLink = await this.employeeDocumentTypeRepository.findOne({
      where: {
        employeeId: linkDto.employeeId,
        documentTypeId: linkDto.documentTypeId,
        deletedAt: IsNull(),
      },
    });

    if (!existingLink) {
      throw EmployeeDocumentTypeLinkNotFoundError.create(
        linkDto.employeeId,
        linkDto.documentTypeId,
      );
    }

    await this.employeeDocumentTypeRepository.unlinkWithPendingAtomic(
      linkDto.employeeId,
      linkDto.documentTypeId,
    );
  }
}

import { AbstractDocumentTypeRepository } from '../../document-type/repositories/document-type.repository.abstract';
import { EmployeeNotFoundError } from '../../employee/errors/employee-not-found.error';
import { AbstractEmployeeRepository } from '../../employee/repositories/employee.repository.abstract';
import { LinkEmployeeDocumentTypeDto } from '../dtos/link-employee-document-type.dto';
import { EmployeeDocumentTypeAlreadyLinkedError } from '../errors/employee-document-type-already-linked.error';
import { EmployeeDocumentTypeLinkNotFoundError } from '../errors/employee-document-type-link-not-found.error';
import { AbstractEmployeeDocumentTypeRepository } from '../repositories/employee-document-type.repository.abstract';
import { LinkEmployeeDocumentTypeUseCase } from './link-employee-document-type.use-case';
import { UnlinkEmployeeDocumentTypeUseCase } from './unlink-employee-document-type.use-case';

type EmployeeRepositoryMock = {
  findOne: jest.Mock;
};

type DocumentTypeRepositoryMock = {
  findOne: jest.Mock;
};

type EmployeeDocumentTypeRepositoryMock = {
  findOne: jest.Mock;
  linkWithPendingAtomic: jest.Mock;
  unlinkWithPendingAtomic: jest.Mock;
};

describe('LinkEmployeeDocumentTypeUseCase and UnlinkEmployeeDocumentTypeUseCase', () => {
  let linkUseCase: LinkEmployeeDocumentTypeUseCase;
  let unlinkUseCase: UnlinkEmployeeDocumentTypeUseCase;
  let employeeRepository: EmployeeRepositoryMock;
  let documentTypeRepository: DocumentTypeRepositoryMock;
  let employeeDocumentTypeRepository: EmployeeDocumentTypeRepositoryMock;

  const linkDto: LinkEmployeeDocumentTypeDto = {
    employeeId: 'emp-1',
    documentTypeId: 'doc-1',
  };

  beforeEach(() => {
    employeeRepository = {
      findOne: jest.fn(),
    };

    documentTypeRepository = {
      findOne: jest.fn(),
    };

    employeeDocumentTypeRepository = {
      findOne: jest.fn(),
      linkWithPendingAtomic: jest.fn(),
      unlinkWithPendingAtomic: jest.fn(),
    };

    linkUseCase = new LinkEmployeeDocumentTypeUseCase(
      employeeRepository as unknown as AbstractEmployeeRepository,
      documentTypeRepository as unknown as AbstractDocumentTypeRepository,
      employeeDocumentTypeRepository as unknown as AbstractEmployeeDocumentTypeRepository,
    );

    unlinkUseCase = new UnlinkEmployeeDocumentTypeUseCase(
      employeeDocumentTypeRepository as unknown as AbstractEmployeeDocumentTypeRepository,
    );
  });

  it('links employee to document type atomically', async () => {
    employeeRepository.findOne.mockResolvedValue({ id: 'emp-1' });
    documentTypeRepository.findOne.mockResolvedValue({ id: 'doc-1' });
    employeeDocumentTypeRepository.findOne.mockResolvedValue(null);

    await expect(linkUseCase.execute(linkDto)).resolves.toBeUndefined();
    expect(
      employeeDocumentTypeRepository.linkWithPendingAtomic,
    ).toHaveBeenCalledWith('emp-1', 'doc-1');
  });

  it('throws when employee is missing on link', async () => {
    employeeRepository.findOne.mockResolvedValue(null);
    documentTypeRepository.findOne.mockResolvedValue({ id: 'doc-1' });
    employeeDocumentTypeRepository.findOne.mockResolvedValue(null);

    await expect(linkUseCase.execute(linkDto)).rejects.toBeInstanceOf(
      EmployeeNotFoundError,
    );
  });

  it('throws when link already exists', async () => {
    employeeRepository.findOne.mockResolvedValue({ id: 'emp-1' });
    documentTypeRepository.findOne.mockResolvedValue({ id: 'doc-1' });
    employeeDocumentTypeRepository.findOne.mockResolvedValue({ id: 'link-1' });

    await expect(linkUseCase.execute(linkDto)).rejects.toBeInstanceOf(
      EmployeeDocumentTypeAlreadyLinkedError,
    );
  });

  it('unlinks employee from document type atomically', async () => {
    employeeDocumentTypeRepository.findOne.mockResolvedValue({ id: 'link-1' });

    await expect(unlinkUseCase.execute(linkDto)).resolves.toBeUndefined();
    expect(
      employeeDocumentTypeRepository.unlinkWithPendingAtomic,
    ).toHaveBeenCalledWith('emp-1', 'doc-1');
  });

  it('throws when link is not found on unlink', async () => {
    employeeDocumentTypeRepository.findOne.mockResolvedValue(null);

    await expect(unlinkUseCase.execute(linkDto)).rejects.toBeInstanceOf(
      EmployeeDocumentTypeLinkNotFoundError,
    );
  });
});

import { FindOneOptions } from 'typeorm';
import { EmployeeDocumentTypeEntity } from '../entities/employee-document-type.entity';

export abstract class AbstractEmployeeDocumentTypeRepository {
  abstract findOne(
    options: FindOneOptions<EmployeeDocumentTypeEntity>,
  ): Promise<EmployeeDocumentTypeEntity | null>;

  abstract linkWithPendingAtomic(
    employeeId: string,
    documentTypeId: string,
  ): Promise<void>;

  abstract unlinkWithPendingAtomic(
    employeeId: string,
    documentTypeId: string,
  ): Promise<void>;
}

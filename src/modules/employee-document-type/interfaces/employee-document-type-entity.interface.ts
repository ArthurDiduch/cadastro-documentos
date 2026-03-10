import { TimestampedEntityInterface } from 'src/shared/interfaces/timestamped-entity.interface';

export interface EmployeeDocumentTypeEntityInterface extends TimestampedEntityInterface {
  employeeId: string;
  documentTypeId: string;
  linkedAt: Date;
  deletedAt: Date | null;
}

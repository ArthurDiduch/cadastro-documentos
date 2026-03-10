import { TimestampedEntityInterface } from 'src/shared/interfaces/timestamped-entity.interface';

export interface PendingDocumentEntityInterface extends TimestampedEntityInterface {
  employeeId: string;
  documentTypeId: string;
  pendingSince: Date;
  deletedAt: Date | null;
}

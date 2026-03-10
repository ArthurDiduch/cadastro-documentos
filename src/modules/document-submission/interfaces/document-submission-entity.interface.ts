import { TimestampedEntityInterface } from 'src/shared/interfaces/timestamped-entity.interface';

export interface DocumentSubmissionEntityInterface extends TimestampedEntityInterface {
  employeeId: string;
  documentTypeId: string;
  fileName: string;
  fileReference: string;
  version: number;
  isCurrent: boolean;
  submittedAt: Date;
  deletedAt: Date | null;
}

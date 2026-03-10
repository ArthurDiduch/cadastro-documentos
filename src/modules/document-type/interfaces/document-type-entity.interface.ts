import { TimestampedEntityInterface } from 'src/shared/interfaces/timestamped-entity.interface';

export interface DocumentTypeEntityInterface extends TimestampedEntityInterface {
  name: string;
  description: string | null;
  deletedAt: Date | null;
}

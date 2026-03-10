import { TimestampedEntityInterface } from 'src/shared/interfaces/timestamped-entity.interface';

export interface EmployeeEntityInterface extends TimestampedEntityInterface {
  name: string;
  email: string;
  registration: string;
  deletedAt: Date | null;
}

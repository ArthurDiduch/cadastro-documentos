import { BaseEntityInterface } from './base-entity.interface';

export interface TimestampedEntityInterface extends BaseEntityInterface {
  createdAt: Date;
  updatedAt: Date;
}

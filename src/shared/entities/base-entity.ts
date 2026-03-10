import {
  BeforeInsert,
  PrimaryColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';
import { generateId } from '../helpers/generate-id.helper';
import { BaseEntityInterface } from '../interfaces/base-entity.interface';

export abstract class BaseEntity
  extends TypeOrmBaseEntity
  implements BaseEntityInterface
{
  @PrimaryColumn('uuid')
  id!: string;

  @BeforeInsert()
  generateId() {
    this.id = generateId();
  }
}

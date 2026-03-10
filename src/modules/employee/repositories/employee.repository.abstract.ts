import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  UpdateResult,
} from 'typeorm';
import { EmployeeEntity } from '../entities/employee.entity';

export abstract class AbstractEmployeeRepository {
  abstract create(entityLike: DeepPartial<EmployeeEntity>): EmployeeEntity;
  abstract save(employee: EmployeeEntity): Promise<EmployeeEntity>;
  abstract update(
    criteria:
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
    partialEntity: QueryDeepPartialEntity<EmployeeEntity>,
  ): Promise<UpdateResult>;
  abstract findOne(
    options: FindOneOptions<EmployeeEntity>,
  ): Promise<EmployeeEntity | null>;
  abstract find(
    options: FindManyOptions<EmployeeEntity>,
  ): Promise<EmployeeEntity[]>;
  abstract findAndCount(
    options: FindManyOptions<EmployeeEntity>,
  ): Promise<[EmployeeEntity[], number]>;
  abstract softDelete(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
  ): Promise<UpdateResult>;
  abstract restore(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
  ): Promise<UpdateResult>;
}

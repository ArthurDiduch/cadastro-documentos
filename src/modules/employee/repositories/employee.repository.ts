import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  Repository,
  UpdateResult,
} from 'typeorm';
import { EmployeeEntity } from '../entities/employee.entity';
import { AbstractEmployeeRepository } from './employee.repository.abstract';

@Injectable()
export class EmployeeRepository implements AbstractEmployeeRepository {
  constructor(
    @InjectRepository(EmployeeEntity)
    private readonly repository: Repository<EmployeeEntity>,
  ) {}

  create(entityLike: DeepPartial<EmployeeEntity>): EmployeeEntity {
    return this.repository.create(entityLike);
  }

  async save(employee: EmployeeEntity): Promise<EmployeeEntity> {
    return this.repository.save(employee);
  }

  async update(
    criteria:
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
    partialEntity: QueryDeepPartialEntity<EmployeeEntity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
  }

  async findOne(
    options: FindOneOptions<EmployeeEntity>,
  ): Promise<EmployeeEntity | null> {
    return this.repository.findOne(options);
  }

  async find(
    options: FindManyOptions<EmployeeEntity>,
  ): Promise<EmployeeEntity[]> {
    return this.repository.find(options);
  }

  async findAndCount(
    options: FindManyOptions<EmployeeEntity>,
  ): Promise<[EmployeeEntity[], number]> {
    return this.repository.findAndCount(options);
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria);
  }

  async restore(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<EmployeeEntity>
      | FindOptionsWhere<EmployeeEntity>[],
  ): Promise<UpdateResult> {
    return this.repository.restore(criteria);
  }
}

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
import { DocumentTypeEntity } from '../entities/document-type.entity';
import { AbstractDocumentTypeRepository } from './document-type.repository.abstract';

@Injectable()
export class DocumentTypeRepository implements AbstractDocumentTypeRepository {
  constructor(
    @InjectRepository(DocumentTypeEntity)
    private readonly repository: Repository<DocumentTypeEntity>,
  ) {}

  create(entityLike: DeepPartial<DocumentTypeEntity>): DocumentTypeEntity {
    return this.repository.create(entityLike);
  }

  async save(documentType: DocumentTypeEntity): Promise<DocumentTypeEntity> {
    return this.repository.save(documentType);
  }

  async update(
    criteria:
      | FindOptionsWhere<DocumentTypeEntity>
      | FindOptionsWhere<DocumentTypeEntity>[],
    partialEntity: QueryDeepPartialEntity<DocumentTypeEntity>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
  }

  async findOne(
    options: FindOneOptions<DocumentTypeEntity>,
  ): Promise<DocumentTypeEntity | null> {
    return this.repository.findOne(options);
  }

  async find(
    options: FindManyOptions<DocumentTypeEntity>,
  ): Promise<DocumentTypeEntity[]> {
    return this.repository.find(options);
  }

  async findAndCount(
    options: FindManyOptions<DocumentTypeEntity>,
  ): Promise<[DocumentTypeEntity[], number]> {
    return this.repository.findAndCount(options);
  }

  async softDelete(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<DocumentTypeEntity>
      | FindOptionsWhere<DocumentTypeEntity>[],
  ): Promise<UpdateResult> {
    return this.repository.softDelete(criteria);
  }

  async restore(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<DocumentTypeEntity>
      | FindOptionsWhere<DocumentTypeEntity>[],
  ): Promise<UpdateResult> {
    return this.repository.restore(criteria);
  }
}

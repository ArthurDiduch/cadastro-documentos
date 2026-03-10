import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  UpdateResult,
} from 'typeorm';
import { DocumentTypeEntity } from '../entities/document-type.entity';

export abstract class AbstractDocumentTypeRepository {
  abstract create(
    entityLike: DeepPartial<DocumentTypeEntity>,
  ): DocumentTypeEntity;
  abstract save(documentType: DocumentTypeEntity): Promise<DocumentTypeEntity>;
  abstract update(
    criteria:
      | FindOptionsWhere<DocumentTypeEntity>
      | FindOptionsWhere<DocumentTypeEntity>[],
    partialEntity: QueryDeepPartialEntity<DocumentTypeEntity>,
  ): Promise<UpdateResult>;
  abstract findOne(
    options: FindOneOptions<DocumentTypeEntity>,
  ): Promise<DocumentTypeEntity | null>;
  abstract find(
    options: FindManyOptions<DocumentTypeEntity>,
  ): Promise<DocumentTypeEntity[]>;
  abstract findAndCount(
    options: FindManyOptions<DocumentTypeEntity>,
  ): Promise<[DocumentTypeEntity[], number]>;
  abstract softDelete(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<DocumentTypeEntity>
      | FindOptionsWhere<DocumentTypeEntity>[],
  ): Promise<UpdateResult>;
  abstract restore(
    criteria:
      | string
      | string[]
      | FindOptionsWhere<DocumentTypeEntity>
      | FindOptionsWhere<DocumentTypeEntity>[],
  ): Promise<UpdateResult>;
}

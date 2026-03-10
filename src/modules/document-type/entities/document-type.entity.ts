import { TimestampedEntity } from 'src/shared/entities/timestamped-entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { DocumentSubmissionEntity } from '../../document-submission/entities/document-submission.entity';
import { DocumentTypeEntityInterface } from '../interfaces/document-type-entity.interface';

@Entity('document_types')
export class DocumentTypeEntity
  extends TimestampedEntity
  implements DocumentTypeEntityInterface
{
  @OneToMany(
    () => DocumentSubmissionEntity,
    (documentSubmission) => documentSubmission.documentType,
  )
  documentSubmissions!: DocumentSubmissionEntity[];

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null;
}

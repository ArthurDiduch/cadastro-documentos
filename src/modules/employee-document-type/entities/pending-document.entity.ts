import { TimestampedEntity } from 'src/shared/entities/timestamped-entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { DocumentTypeEntity } from '../../document-type/entities/document-type.entity';
import { EmployeeEntity } from '../../employee/entities/employee.entity';
import { PendingDocumentEntityInterface } from '../interfaces/pending-document-entity.interface';

@Entity('pending_documents')
@Index('idx_pending_document_unique', ['employeeId', 'documentTypeId'], {
  unique: true,
})
export class PendingDocumentEntity
  extends TimestampedEntity
  implements PendingDocumentEntityInterface
{
  @ManyToOne(() => EmployeeEntity, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee!: EmployeeEntity;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId!: string;

  @ManyToOne(() => DocumentTypeEntity, { nullable: false })
  @JoinColumn({ name: 'document_type_id' })
  documentType!: DocumentTypeEntity;

  @Column({ name: 'document_type_id', type: 'uuid' })
  documentTypeId!: string;

  @Column({ name: 'pending_since', type: 'timestamp with time zone' })
  pendingSince!: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null;
}

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
import { DocumentSubmissionEntityInterface } from '../interfaces/document-submission-entity.interface';

@Entity('document_submissions')
@Index('idx_doc_sub_employee_document_current', [
  'employeeId',
  'documentTypeId',
  'isCurrent',
])
export class DocumentSubmissionEntity
  extends TimestampedEntity
  implements DocumentSubmissionEntityInterface
{
  @ManyToOne(() => EmployeeEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'employee_id' })
  employee!: EmployeeEntity;

  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId!: string;

  @ManyToOne(() => DocumentTypeEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'document_type_id' })
  documentType!: DocumentTypeEntity;

  @Column({ name: 'document_type_id', type: 'uuid' })
  documentTypeId!: string;

  @Column({ name: 'file_name', length: 255 })
  fileName!: string;

  @Column({ name: 'file_reference', length: 255 })
  fileReference!: string;

  @Column({ type: 'int' })
  version!: number;

  @Column({ name: 'is_current', type: 'boolean', default: true })
  isCurrent!: boolean;

  @Column({ name: 'submitted_at', type: 'timestamp with time zone' })
  submittedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null;
}

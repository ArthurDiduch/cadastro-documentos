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
import { EmployeeDocumentTypeEntityInterface } from '../interfaces/employee-document-type-entity.interface';

@Entity('employee_document_types')
@Index('idx_employee_document_type_unique', ['employeeId', 'documentTypeId'], {
  unique: true,
})
export class EmployeeDocumentTypeEntity
  extends TimestampedEntity
  implements EmployeeDocumentTypeEntityInterface
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

  @Column({ name: 'linked_at', type: 'timestamp with time zone' })
  linkedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null;
}

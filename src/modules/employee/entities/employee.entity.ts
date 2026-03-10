import { TimestampedEntity } from 'src/shared/entities/timestamped-entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { DocumentSubmissionEntity } from '../../document-submission/entities/document-submission.entity';
import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';

@Entity('employees')
export class EmployeeEntity
  extends TimestampedEntity
  implements EmployeeEntityInterface
{
  @OneToMany(
    () => DocumentSubmissionEntity,
    (documentSubmission) => documentSubmission.employee,
  )
  documentSubmissions!: DocumentSubmissionEntity[];

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  registration!: string;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt!: Date | null;
}

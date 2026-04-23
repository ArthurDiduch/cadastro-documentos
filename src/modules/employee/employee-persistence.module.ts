import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeRepository } from './repositories/employee.repository';
import { AbstractEmployeeRepository } from './repositories/employee.repository.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  providers: [
    { provide: AbstractEmployeeRepository, useClass: EmployeeRepository },
  ],
  exports: [AbstractEmployeeRepository],
})
export class EmployeePersistenceModule {}

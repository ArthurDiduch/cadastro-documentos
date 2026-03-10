import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeRepository } from './repositories/employee.repository';
import { AbstractEmployeeRepository } from './repositories/employee.repository.abstract';
import { FindEmployeeByIdUseCase } from './use-cases/find-employee-by-id.use-case';
import { ListEmployeesUseCase } from './use-cases/list-employees.use-case';
import { ReactivateEmployeeUseCase } from './use-cases/reactivate-employee.use-case';
import { RegisterEmployeeUseCase } from './use-cases/register-employee.use-case';
import { SoftDeleteEmployeeUseCase } from './use-cases/soft-delete-employee.use-case';
import { UpdateEmployeeUseCase } from './use-cases/update-employee.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  controllers: [EmployeeController],
  providers: [
    {
      provide: AbstractEmployeeRepository,
      useClass: EmployeeRepository,
    },
    RegisterEmployeeUseCase,
    FindEmployeeByIdUseCase,
    ListEmployeesUseCase,
    UpdateEmployeeUseCase,
    SoftDeleteEmployeeUseCase,
    ReactivateEmployeeUseCase,
  ],
})
export class EmployeeModule {}

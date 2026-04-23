import { Module } from '@nestjs/common';
import { EmployeeController } from './controllers/employee.controller';
import { EmployeePersistenceModule } from './employee-persistence.module';
import { FindEmployeeByIdUseCase } from './use-cases/find-employee-by-id.use-case';
import { ListEmployeesUseCase } from './use-cases/list-employees.use-case';
import { ReactivateEmployeeUseCase } from './use-cases/reactivate-employee.use-case';
import { RegisterEmployeeUseCase } from './use-cases/register-employee.use-case';
import { SoftDeleteEmployeeUseCase } from './use-cases/soft-delete-employee.use-case';
import { UpdateEmployeeUseCase } from './use-cases/update-employee.use-case';

@Module({
  imports: [EmployeePersistenceModule],
  controllers: [EmployeeController],
  providers: [
    RegisterEmployeeUseCase,
    FindEmployeeByIdUseCase,
    ListEmployeesUseCase,
    UpdateEmployeeUseCase,
    SoftDeleteEmployeeUseCase,
    ReactivateEmployeeUseCase,
  ],
})
export class EmployeeModule {}

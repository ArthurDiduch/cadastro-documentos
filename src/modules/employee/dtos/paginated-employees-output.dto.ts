import { PaginatedOutputDto } from 'src/shared/dtos/paginated-output.dto';
import { EmployeeOutputDto } from './employee-output.dto';

export class PaginatedEmployeesOutputDto extends PaginatedOutputDto(
  EmployeeOutputDto,
) {}

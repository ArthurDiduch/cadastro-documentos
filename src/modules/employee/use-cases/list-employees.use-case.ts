import { Injectable } from '@nestjs/common';
import { ILike, IsNull, Not } from 'typeorm';
import { EmployeeOutputDto } from '../dtos/employee-output.dto';
import { ListEmployeesQueryDto } from '../dtos/list-employees-query.dto';
import { PaginatedEmployeesOutputDto } from '../dtos/paginated-employees-output.dto';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';

@Injectable()
export class ListEmployeesUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
  ) {}

  async execute(
    query: ListEmployeesQueryDto,
  ): Promise<PaginatedEmployeesOutputDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.name ? { name: ILike(`%${query.name}%`) } : {}),
      ...(query.email ? { email: ILike(`%${query.email}%`) } : {}),
      ...(query.registration
        ? { registration: ILike(`%${query.registration}%`) }
        : {}),
      ...(query.isActive === true
        ? { deletedAt: IsNull() }
        : query.isActive === false
          ? { deletedAt: Not(IsNull()) }
          : {}),
    };

    const [employees, total] = await this.employeeRepository.findAndCount({
      where,
      withDeleted: query.isActive !== true,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items: employees.map((employee) =>
        EmployeeOutputDto.fromEmployee(employee),
      ),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

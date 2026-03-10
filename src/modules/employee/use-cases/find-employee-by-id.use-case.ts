import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { EmployeeOutputDto } from '../dtos/employee-output.dto';
import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';

@Injectable()
export class FindEmployeeByIdUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
  ) {}

  async execute(
    id: string,
    includeInactive: boolean = false,
  ): Promise<EmployeeOutputDto> {
    const employee = await this.employeeRepository.findOne({
      where: includeInactive ? { id } : { id, deletedAt: IsNull() },
      withDeleted: includeInactive,
    });

    if (!employee) {
      throw EmployeeNotFoundError.create(id);
    }

    return EmployeeOutputDto.fromEmployee(employee);
  }
}

import { Injectable } from '@nestjs/common';
import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';

@Injectable()
export class SoftDeleteEmployeeUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!employee) {
      throw EmployeeNotFoundError.create(id);
    }

    if (employee.deletedAt) {
      return;
    }

    await this.employeeRepository.softDelete({ id });
  }
}

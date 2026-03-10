import { Injectable } from '@nestjs/common';
import { EmployeeOutputDto } from '../dtos/employee-output.dto';
import { EmployeeEmailAlreadyExistsError } from '../errors/employee-email-already-exists.error';
import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { EmployeeRegistrationAlreadyExistsError } from '../errors/employee-registration-already-exists.error';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';

@Injectable()
export class ReactivateEmployeeUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
  ) {}

  async execute(id: string): Promise<EmployeeOutputDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!employee) {
      throw EmployeeNotFoundError.create(id);
    }

    if (!employee.deletedAt) {
      return EmployeeOutputDto.fromEmployee(employee);
    }

    const [existingEmail, existingRegistration] = await Promise.all([
      this.employeeRepository.findOne({ where: { email: employee.email } }),
      this.employeeRepository.findOne({
        where: { registration: employee.registration },
      }),
    ]);

    if (existingEmail && existingEmail.id !== id) {
      throw EmployeeEmailAlreadyExistsError.create();
    }

    if (existingRegistration && existingRegistration.id !== id) {
      throw EmployeeRegistrationAlreadyExistsError.create();
    }

    await this.employeeRepository.restore({ id });

    const restoredEmployee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!restoredEmployee) {
      throw EmployeeNotFoundError.create(id);
    }

    return EmployeeOutputDto.fromEmployee(restoredEmployee);
  }
}

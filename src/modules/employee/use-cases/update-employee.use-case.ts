import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { EmployeeOutputDto } from '../dtos/employee-output.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { EmployeeEmailAlreadyExistsError } from '../errors/employee-email-already-exists.error';
import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { EmployeeRegistrationAlreadyExistsError } from '../errors/employee-registration-already-exists.error';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateEmployeeDto,
  ): Promise<EmployeeOutputDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!employee) {
      throw EmployeeNotFoundError.create(id);
    }

    if (dto.email && dto.email !== employee.email) {
      const existingByEmail = await this.employeeRepository.findOne({
        where: { email: dto.email },
        withDeleted: true,
      });
      if (existingByEmail && existingByEmail.id !== id) {
        throw EmployeeEmailAlreadyExistsError.create();
      }
    }

    if (dto.registration && dto.registration !== employee.registration) {
      const existingByRegistration = await this.employeeRepository.findOne({
        where: { registration: dto.registration },
        withDeleted: true,
      });
      if (existingByRegistration && existingByRegistration.id !== id) {
        throw EmployeeRegistrationAlreadyExistsError.create();
      }
    }

    await this.employeeRepository.update({ id }, dto);

    const updatedEmployee = await this.employeeRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!updatedEmployee) {
      throw EmployeeNotFoundError.create(id);
    }

    return EmployeeOutputDto.fromEmployee(updatedEmployee);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { RegisterEmployeeOutputDto } from '../dtos/register-employee-output.dto';
import { EmployeeEmailAlreadyExistsError } from '../errors/employee-email-already-exists.error';
import { EmployeeRegistrationAlreadyExistsError } from '../errors/employee-registration-already-exists.error';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';

@Injectable()
export class RegisterEmployeeUseCase {
  constructor(
    private readonly employeeRepository: AbstractEmployeeRepository,
  ) {}

  async execute(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<RegisterEmployeeOutputDto> {
    const [existingByEmail, existingByRegistration] = await Promise.all([
      this.employeeRepository.findOne({
        where: { email: createEmployeeDto.email },
        withDeleted: true,
      }),
      this.employeeRepository.findOne({
        where: { registration: createEmployeeDto.registration },
        withDeleted: true,
      }),
    ]);

    if (existingByEmail) {
      throw EmployeeEmailAlreadyExistsError.create();
    }

    if (existingByRegistration) {
      throw EmployeeRegistrationAlreadyExistsError.create();
    }

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      deletedAt: null,
    });
    const persistedEmployee = await this.employeeRepository.save(employee);

    return RegisterEmployeeOutputDto.fromEmployee(persistedEmployee);
  }
}

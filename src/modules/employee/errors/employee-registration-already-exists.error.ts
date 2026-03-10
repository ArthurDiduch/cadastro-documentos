import { ApplicationError } from 'src/shared/errors/application.error';

export class EmployeeRegistrationAlreadyExistsError extends ApplicationError {
  static create(): EmployeeRegistrationAlreadyExistsError {
    return new EmployeeRegistrationAlreadyExistsError();
  }

  constructor() {
    super(
      'EMPLOYEE_REGISTRATION_ALREADY_EXISTS',
      'Employee registration already exists.',
    );
  }
}

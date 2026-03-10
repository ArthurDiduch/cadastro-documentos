import { ApplicationError } from 'src/shared/errors/application.error';

export class EmployeeEmailAlreadyExistsError extends ApplicationError {
  static create(): EmployeeEmailAlreadyExistsError {
    return new EmployeeEmailAlreadyExistsError();
  }

  constructor() {
    super('EMPLOYEE_EMAIL_ALREADY_EXISTS', 'Employee email already exists.');
  }
}

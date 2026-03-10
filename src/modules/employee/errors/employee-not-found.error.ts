import { ApplicationError } from 'src/shared/errors/application.error';

export class EmployeeNotFoundError extends ApplicationError {
  static create(id: string): EmployeeNotFoundError {
    return new EmployeeNotFoundError(id);
  }

  constructor(id: string) {
    super('EMPLOYEE_NOT_FOUND', `Employee with id ${id} was not found.`);
  }
}

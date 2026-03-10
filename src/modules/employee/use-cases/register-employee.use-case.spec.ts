import { EmployeeEmailAlreadyExistsError } from '../errors/employee-email-already-exists.error';
import { EmployeeRegistrationAlreadyExistsError } from '../errors/employee-registration-already-exists.error';
import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';
import { RegisterEmployeeUseCase } from './register-employee.use-case';

type EmployeeRepositoryMock = {
  create: jest.Mock;
  save: jest.Mock;
  update: jest.Mock;
  findOne: jest.Mock;
  find: jest.Mock;
  findAndCount: jest.Mock;
  softDelete: jest.Mock;
  restore: jest.Mock;
};

describe('RegisterEmployeeUseCase', () => {
  let useCase: RegisterEmployeeUseCase;
  let employeeRepository: EmployeeRepositoryMock;

  beforeEach(() => {
    employeeRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
    };

    useCase = new RegisterEmployeeUseCase(
      employeeRepository as unknown as AbstractEmployeeRepository,
    );
  });

  it('registers an employee when email and registration are available', async () => {
    const createEmployeeDto = {
      name: 'Arthur Diduch',
      email: 'arthur@example.com',
      registration: 'EMP20260001',
    };
    const persistedEmployee = buildEmployeeEntity(createEmployeeDto);

    employeeRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    employeeRepository.create.mockReturnValue(persistedEmployee);
    employeeRepository.save.mockResolvedValue(persistedEmployee);

    await expect(useCase.execute(createEmployeeDto)).resolves.toEqual({
      id: persistedEmployee.id,
      name: persistedEmployee.name,
      email: persistedEmployee.email,
      registration: persistedEmployee.registration,
      createdAt: persistedEmployee.createdAt,
      updatedAt: persistedEmployee.updatedAt,
    });

    expect(employeeRepository.findOne).toHaveBeenCalledTimes(2);
    expect(employeeRepository.create.mock.calls).toEqual([
      [
        {
          ...createEmployeeDto,
          deletedAt: null,
        },
      ],
    ]);
    expect(employeeRepository.save.mock.calls).toEqual([[persistedEmployee]]);
  });

  it('throws when the email is already registered', async () => {
    const createEmployeeDto = {
      name: 'Arthur Diduch',
      email: 'arthur@example.com',
      registration: 'EMP20260001',
    };

    employeeRepository.findOne
      .mockResolvedValueOnce(buildEmployeeEntity(createEmployeeDto))
      .mockResolvedValueOnce(null);

    await expect(useCase.execute(createEmployeeDto)).rejects.toBeInstanceOf(
      EmployeeEmailAlreadyExistsError,
    );
    expect(employeeRepository.save.mock.calls).toHaveLength(0);
  });

  it('throws when the registration is already registered', async () => {
    const createEmployeeDto = {
      name: 'Arthur Diduch',
      email: 'arthur@example.com',
      registration: 'EMP20260001',
    };

    employeeRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildEmployeeEntity(createEmployeeDto));

    await expect(useCase.execute(createEmployeeDto)).rejects.toBeInstanceOf(
      EmployeeRegistrationAlreadyExistsError,
    );
    expect(employeeRepository.save.mock.calls).toHaveLength(0);
  });
});

function buildEmployeeEntity(
  overrides: Partial<EmployeeEntityInterface> = {},
): EmployeeEntityInterface {
  return {
    id: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    name: 'Arthur Diduch',
    email: 'arthur@example.com',
    registration: 'EMP20260001',
    createdAt: new Date('2026-03-10T12:00:00.000Z'),
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

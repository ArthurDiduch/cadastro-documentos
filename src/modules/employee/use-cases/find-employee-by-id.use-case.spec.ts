import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';
import { FindEmployeeByIdUseCase } from './find-employee-by-id.use-case';

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

describe('FindEmployeeByIdUseCase', () => {
  let useCase: FindEmployeeByIdUseCase;
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

    useCase = new FindEmployeeByIdUseCase(
      employeeRepository as unknown as AbstractEmployeeRepository,
    );
  });

  it('returns employee by id', async () => {
    employeeRepository.findOne.mockResolvedValue(buildEmployeeEntity());

    await expect(useCase.execute('emp-1')).resolves.toMatchObject({
      id: 'emp-1',
      isActive: true,
    });
  });

  it('throws when employee does not exist', async () => {
    employeeRepository.findOne.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toBeInstanceOf(
      EmployeeNotFoundError,
    );
  });
});

function buildEmployeeEntity(
  overrides: Partial<EmployeeEntityInterface> = {},
): EmployeeEntityInterface {
  return {
    id: 'emp-1',
    name: 'Arthur',
    email: 'arthur@example.com',
    registration: 'EMP1',
    createdAt: new Date('2026-03-10T12:00:00.000Z'),
    updatedAt: new Date('2026-03-10T12:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

import { EmployeeNotFoundError } from '../errors/employee-not-found.error';
import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';
import { ReactivateEmployeeUseCase } from './reactivate-employee.use-case';
import { SoftDeleteEmployeeUseCase } from './soft-delete-employee.use-case';

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

describe('SoftDeleteEmployeeUseCase and ReactivateEmployeeUseCase', () => {
  let softDeleteUseCase: SoftDeleteEmployeeUseCase;
  let reactivateUseCase: ReactivateEmployeeUseCase;
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

    softDeleteUseCase = new SoftDeleteEmployeeUseCase(
      employeeRepository as unknown as AbstractEmployeeRepository,
    );
    reactivateUseCase = new ReactivateEmployeeUseCase(
      employeeRepository as unknown as AbstractEmployeeRepository,
    );
  });

  it('soft deletes an active employee', async () => {
    employeeRepository.findOne.mockResolvedValue(buildEmployeeEntity());
    employeeRepository.softDelete.mockResolvedValue({} as never);

    await expect(softDeleteUseCase.execute('emp-1')).resolves.toBeUndefined();
    expect(employeeRepository.softDelete).toHaveBeenCalledWith({ id: 'emp-1' });
  });

  it('throws on soft delete when employee does not exist', async () => {
    employeeRepository.findOne.mockResolvedValue(null);

    await expect(softDeleteUseCase.execute('missing')).rejects.toBeInstanceOf(
      EmployeeNotFoundError,
    );
  });

  it('reactivates an inactive employee', async () => {
    employeeRepository.findOne
      .mockResolvedValueOnce(buildEmployeeEntity({ deletedAt: new Date() }))
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildEmployeeEntity());
    employeeRepository.restore.mockResolvedValue({} as never);

    await expect(reactivateUseCase.execute('emp-1')).resolves.toMatchObject({
      id: 'emp-1',
      isActive: true,
    });
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

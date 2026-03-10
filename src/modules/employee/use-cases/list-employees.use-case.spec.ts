import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';
import { AbstractEmployeeRepository } from '../repositories/employee.repository.abstract';
import { ListEmployeesUseCase } from './list-employees.use-case';

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

describe('ListEmployeesUseCase', () => {
  let useCase: ListEmployeesUseCase;
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

    useCase = new ListEmployeesUseCase(
      employeeRepository as unknown as AbstractEmployeeRepository,
    );
  });

  it('returns paginated employees', async () => {
    employeeRepository.findAndCount.mockResolvedValue([
      [buildEmployeeEntity()],
      1,
    ]);

    await expect(
      useCase.execute({ page: 1, limit: 10, isActive: true }),
    ).resolves.toMatchObject({
      items: [
        {
          id: 'emp-1',
          isActive: true,
        },
      ],
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
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

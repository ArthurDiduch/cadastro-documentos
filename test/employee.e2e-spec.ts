import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { setupGlobalPipes } from '../src/configurations/global-pipes.config';
import { EmployeeController } from '../src/modules/employee/controllers/employee.controller';
import { EmployeeEntityInterface } from '../src/modules/employee/interfaces/employee-entity.interface';
import { AbstractEmployeeRepository } from '../src/modules/employee/repositories/employee.repository.abstract';
import { FindEmployeeByIdUseCase } from '../src/modules/employee/use-cases/find-employee-by-id.use-case';
import { ListEmployeesUseCase } from '../src/modules/employee/use-cases/list-employees.use-case';
import { ReactivateEmployeeUseCase } from '../src/modules/employee/use-cases/reactivate-employee.use-case';
import { RegisterEmployeeUseCase } from '../src/modules/employee/use-cases/register-employee.use-case';
import { SoftDeleteEmployeeUseCase } from '../src/modules/employee/use-cases/soft-delete-employee.use-case';
import { UpdateEmployeeUseCase } from '../src/modules/employee/use-cases/update-employee.use-case';
import { ApplicationErrorFilter } from '../src/shared/filters/application-error.filter';

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

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];
  let employeeRepository: EmployeeRepositoryMock;

  beforeEach(async () => {
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

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        RegisterEmployeeUseCase,
        FindEmployeeByIdUseCase,
        ListEmployeesUseCase,
        UpdateEmployeeUseCase,
        SoftDeleteEmployeeUseCase,
        ReactivateEmployeeUseCase,
        {
          provide: AbstractEmployeeRepository,
          useValue: employeeRepository as unknown as AbstractEmployeeRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(setupGlobalPipes());
    app.useGlobalFilters(new ApplicationErrorFilter());

    await app.init();
    const server: unknown = app.getHttpServer();
    httpServer = server as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /employees returns 201 when payload is valid', async () => {
    const payload = {
      name: 'Arthur Diduch',
      email: 'arthur@example.com',
      registration: 'EMP20260001',
    };
    const employee = buildEmployeeEntity(payload);

    employeeRepository.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    employeeRepository.create.mockReturnValue(employee);
    employeeRepository.save.mockResolvedValue(employee);

    const response = await request(httpServer)
      .post('/employees')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      registration: employee.registration,
      createdAt: employee.createdAt.toISOString(),
      updatedAt: employee.updatedAt.toISOString(),
    });
  });

  it('GET /employees/:id returns 200 for active employee', async () => {
    const employee = buildEmployeeEntity();
    employeeRepository.findOne.mockResolvedValue(employee);

    const response = await request(httpServer)
      .get(`/employees/${employee.id}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: employee.id,
      isActive: true,
    });
  });

  it('GET /employees returns paginated payload', async () => {
    const employee = buildEmployeeEntity();
    employeeRepository.findAndCount.mockResolvedValue([[employee], 1]);

    const response = await request(httpServer)
      .get('/employees?page=1&limit=10&isActive=true')
      .expect(200);

    expect(response.body).toMatchObject({
      metadata: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });

    const items = (response.body as { items: unknown[] }).items;
    expect(items).toHaveLength(1);
  });

  it('PATCH /employees/:id updates employee', async () => {
    const employee = buildEmployeeEntity();
    const updatedEmployee = buildEmployeeEntity({ name: 'Arthur Updated' });

    employeeRepository.findOne
      .mockResolvedValueOnce(employee)
      .mockResolvedValueOnce(updatedEmployee);
    employeeRepository.update.mockResolvedValue({} as never);

    const response = await request(httpServer)
      .patch(`/employees/${employee.id}`)
      .send({ name: 'Arthur Updated' })
      .expect(200);

    expect(response.body).toMatchObject({
      id: employee.id,
      name: 'Arthur Updated',
      isActive: true,
    });
  });

  it('DELETE /employees/:id returns 204', async () => {
    const employee = buildEmployeeEntity();
    employeeRepository.findOne.mockResolvedValue(employee);
    employeeRepository.softDelete.mockResolvedValue({} as never);

    await request(httpServer).delete(`/employees/${employee.id}`).expect(204);
  });

  it('PATCH /employees/:id/reactivate returns 200', async () => {
    const employee = buildEmployeeEntity({ deletedAt: new Date() });

    employeeRepository.findOne
      .mockResolvedValueOnce(employee)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(buildEmployeeEntity());
    employeeRepository.restore.mockResolvedValue({} as never);

    const response = await request(httpServer)
      .patch(`/employees/${employee.id}/reactivate`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: employee.id,
      isActive: true,
    });
  });

  it('documents key employee routes in Swagger', () => {
    const document: OpenAPIObject = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Test').build(),
    );

    expect(document.paths['/employees']?.post).toBeDefined();
    expect(document.paths['/employees']?.get).toBeDefined();
    expect(document.paths['/employees/{id}']?.get).toBeDefined();
    expect(document.paths['/employees/{id}']?.patch).toBeDefined();
    expect(document.paths['/employees/{id}']?.delete).toBeDefined();
    expect(document.paths['/employees/{id}/reactivate']?.patch).toBeDefined();
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

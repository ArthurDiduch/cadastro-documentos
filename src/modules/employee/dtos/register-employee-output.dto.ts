import { ApiProperty } from '@nestjs/swagger';
import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';

export class RegisterEmployeeOutputDto {
  @ApiProperty({
    example: 'e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973',
    description: 'Employee unique identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'Arthur Diduch',
    description: 'Employee full name.',
  })
  name!: string;

  @ApiProperty({
    example: 'arthur@example.com',
    description: 'Employee email address.',
  })
  email!: string;

  @ApiProperty({
    example: 'EMP20260001',
    description: 'Unique employee registration code.',
  })
  registration!: string;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Creation timestamp.',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-03-10T12:00:00.000Z',
    description: 'Last update timestamp.',
  })
  updatedAt!: Date;

  static fromEmployee(
    employee: EmployeeEntityInterface,
  ): RegisterEmployeeOutputDto {
    return Object.assign(new RegisterEmployeeOutputDto(), {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      registration: employee.registration,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  }
}

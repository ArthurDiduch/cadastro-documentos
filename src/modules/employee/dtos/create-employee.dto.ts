import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmployeeEntityInterface } from '../interfaces/employee-entity.interface';

export class CreateEmployeeDto implements Omit<
  EmployeeEntityInterface,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {
  @ApiProperty({
    example: 'Arthur Diduch',
    minLength: 2,
    maxLength: 120,
    description: 'Full employee name.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    example: 'arthur@example.com',
    maxLength: 254,
    description: 'Employee email address.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    example: 'EMP20260001',
    minLength: 4,
    maxLength: 20,
    description: 'Unique employee registration code.',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(20)
  registration!: string;
}

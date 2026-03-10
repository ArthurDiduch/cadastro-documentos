import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/shared/dtos/error-response.dto';
import { ValidationErrorResponseDto } from 'src/shared/dtos/validation-error-response.dto';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeOutputDto } from '../dtos/employee-output.dto';
import { ListEmployeesQueryDto } from '../dtos/list-employees-query.dto';
import { PaginatedEmployeesOutputDto } from '../dtos/paginated-employees-output.dto';
import { RegisterEmployeeOutputDto } from '../dtos/register-employee-output.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { FindEmployeeByIdUseCase } from '../use-cases/find-employee-by-id.use-case';
import { ListEmployeesUseCase } from '../use-cases/list-employees.use-case';
import { ReactivateEmployeeUseCase } from '../use-cases/reactivate-employee.use-case';
import { RegisterEmployeeUseCase } from '../use-cases/register-employee.use-case';
import { SoftDeleteEmployeeUseCase } from '../use-cases/soft-delete-employee.use-case';
import { UpdateEmployeeUseCase } from '../use-cases/update-employee.use-case';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly registerEmployeeUseCase: RegisterEmployeeUseCase,
    private readonly findEmployeeByIdUseCase: FindEmployeeByIdUseCase,
    private readonly listEmployeesUseCase: ListEmployeesUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly softDeleteEmployeeUseCase: SoftDeleteEmployeeUseCase,
    private readonly reactivateEmployeeUseCase: ReactivateEmployeeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register employee',
    description:
      'Creates a new employee when email and registration are unique.',
  })
  @ApiCreatedResponse({
    type: RegisterEmployeeOutputDto,
    description: 'Employee registered successfully.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Employee email or registration already exists.',
  })
  async register(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<RegisterEmployeeOutputDto> {
    return this.registerEmployeeUseCase.execute(createEmployeeDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get employee by id' })
  @ApiParam({ name: 'id', description: 'Employee id (UUID).' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'When true, allows returning soft-deleted employees.',
  })
  @ApiOkResponse({
    type: EmployeeOutputDto,
    description: 'Employee found.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee not found.',
  })
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('includeInactive') includeInactive?: string,
  ): Promise<EmployeeOutputDto> {
    return this.findEmployeeByIdUseCase.execute(id, includeInactive === 'true');
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List employees with pagination and filters' })
  @ApiOkResponse({
    type: PaginatedEmployeesOutputDto,
    description: 'Employees paginated list.',
  })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  async getPaginated(
    @Query() query: ListEmployeesQueryDto,
  ): Promise<PaginatedEmployeesOutputDto> {
    return this.listEmployeesUseCase.execute(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update active employee' })
  @ApiParam({ name: 'id', description: 'Employee id (UUID).' })
  @ApiOkResponse({ type: EmployeeOutputDto, description: 'Employee updated.' })
  @ApiBadRequestResponse({
    type: ValidationErrorResponseDto,
    description: 'Validation error in submitted data.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee not found.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Employee email or registration already exists.',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeOutputDto> {
    return this.updateEmployeeUseCase.execute(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete employee' })
  @ApiParam({ name: 'id', description: 'Employee id (UUID).' })
  @ApiNoContentResponse({ description: 'Employee soft deleted.' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee not found.',
  })
  async softDelete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.softDeleteEmployeeUseCase.execute(id);
  }

  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate soft-deleted employee' })
  @ApiParam({ name: 'id', description: 'Employee id (UUID).' })
  @ApiOkResponse({
    type: EmployeeOutputDto,
    description: 'Employee active again.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Employee not found.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Employee email or registration already exists.',
  })
  async reactivate(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<EmployeeOutputDto> {
    return this.reactivateEmployeeUseCase.execute(id);
  }
}

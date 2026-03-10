import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import pgDatabaseConfig from './configurations/pg-database.config';
import { PgTypeOrmConfigService } from './configurations/pg-typeorm-config.service';
import { DocumentSubmissionModule } from './modules/document-submission/document-submission.module';
import { DocumentTypeModule } from './modules/document-type/document-type.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ApplicationErrorFilter } from './shared/filters/application-error.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [pgDatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: PgTypeOrmConfigService,
    }),
    EmployeeModule,
    DocumentTypeModule,
    DocumentSubmissionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ApplicationErrorFilter,
    },
  ],
})
export class AppModule {}

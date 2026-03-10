import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import pgDatabaseConfig from './configurations/pg-database.config';
import { PgTypeOrmConfigService } from './configurations/pg-typeorm-config.service';

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
  ],
})
export class AppModule {}

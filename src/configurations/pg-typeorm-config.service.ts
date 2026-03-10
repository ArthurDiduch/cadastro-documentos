import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { requireConfigValues } from '../shared/helpers/required-config.helper';

@Injectable()
export class PgTypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = requireConfigValues(this.configService, [
      'pgDatabase.host',
      'pgDatabase.username',
      'pgDatabase.password',
      'pgDatabase.database',
    ] as const);

    const schema = this.configService.get<string>('pgDatabase.schema');
    const port = this.configService.get<number>('pgDatabase.port') ?? 5432;
    const synchronize =
      this.configService.get<boolean>('pgDatabase.synchronize') ?? false;

    return {
      type: 'postgres',
      host: config['pgDatabase.host'],
      port,
      username: config['pgDatabase.username'],
      password: config['pgDatabase.password'],
      database: config['pgDatabase.database'],
      autoLoadEntities: true,
      synchronize,
      ...(schema ? { schema } : {}),
    };
  }
}

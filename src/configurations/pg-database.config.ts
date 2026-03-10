import { registerAs } from '@nestjs/config';

export default registerAs('pgDatabase', () => {
  const port = Number.parseInt(process.env.DB_PG_PORT ?? '5432', 10);

  return {
    host: process.env.DB_PG_HOST,
    port: Number.isNaN(port) ? 5432 : port,
    username: process.env.DB_PG_USERNAME,
    password: process.env.DB_PG_PASSWORD,
    database: process.env.DB_PG_NAME,
    schema: process.env.DB_PG_SCHEMA,
    synchronize: process.env.DB_PG_SYNCHRONIZE === 'true',
  };
});

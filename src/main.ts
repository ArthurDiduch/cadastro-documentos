import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGlobalPipes } from './configurations/global-pipes.config';
import { setupSwagger } from './configurations/setup-swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(setupGlobalPipes());

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  const port = configService.get<number>('APP_PORT', 3000);

  if (nodeEnv !== 'production') {
    setupSwagger(app);
  }

  await app.listen(port);
}
void bootstrap();

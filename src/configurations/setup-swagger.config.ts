import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

type SwaggerApp = Parameters<typeof SwaggerModule.createDocument>[0];

export function setupSwagger(app: SwaggerApp): void {
  const config = new DocumentBuilder()
    .setTitle('Cadastro Documentos API')
    .setDescription('API documentation for Cadastro Documentos.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}

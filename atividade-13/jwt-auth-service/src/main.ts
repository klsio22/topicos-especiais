import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  type OpenAPIObject,
} from '@nestjs/swagger';
import { writeFileSync } from 'node:fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration

  const config = new DocumentBuilder()
    .setTitle('API com Swagger')
    .setDescription('Documentação automática da API com Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // optionally write swagger.json to project root
  try {
    writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  } catch {
    // ignore write errors in environments without write permission
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

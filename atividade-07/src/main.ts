import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ValidationPipe global removido: validação será feita manualmente no service
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

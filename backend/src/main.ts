import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Включение CORS для фронтенда на Next.js
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Глобальная валидация DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Настройка Swagger OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Piano Transcription API')
    .setDescription('The AI-Powered Audio-to-Score platform API endpoints')
    .setVersion('1.0')
    .addBearerAuth() // Для OAuth 2.0 / JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Префикс для всех маршрутов
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 8000;
  await app.listen(port);
  
  logger.log(`🚀 Backend application is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
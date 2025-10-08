import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const docConfig = new DocumentBuilder()
    .setTitle('AI Marketing API')
    .setDescription('API documentation of the AI Marketing service')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // This name ('access-token') should match the name used in @ApiBearerAuth() decorator
    )
    .build();
  const openApiDoc = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc));

  const configService = app.get(ConfigService);
  const port: number = configService.get('PORT') || 8080;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap().catch((err) => {
  console.error('❌ Error during app bootstrap:', err);
  process.exit(1);
});

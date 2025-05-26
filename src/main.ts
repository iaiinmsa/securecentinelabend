import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });
  
    // Swagger setup
    const config = new DocumentBuilder()
    .setTitle('API Securcentinela')
    .setDescription('Documentación de la API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(); 
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 App corriendo en el puerto ${process.env.PORT ?? 3000}`);
}
bootstrap();

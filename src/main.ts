import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

const PORT = parseInt(process.env.PORT, 10) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));
  app.use(helmet());
  app.use(compression({ threshold: 512 }));

  const options = new DocumentBuilder()
    .setTitle('Connect Server Project API Doc')
    .setDescription('Connect Server API description')
    .setVersion('1.0')
    .addServer('/')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(PORT, () => {
    console.log(`🚀 Application running at port http://localhost:${PORT}`);
  });
}
bootstrap();

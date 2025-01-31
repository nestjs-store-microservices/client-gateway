import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { RpcCustomExceptionFilter } from './common';
import helmet from 'helmet';

async function bootstrap() {
  const looger = new Logger('Client-Gateway');

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: envs.urlFrontEnds,
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  app.setGlobalPrefix('api');

  await app.listen(envs.port);
  looger.log(`Client-Gateway running on port: ${envs.port}`);
}
bootstrap();

import { INestApplication, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import RedisStore from 'connect-redis';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import * as redis from 'redis';

import { RequestLoggerInterceptor } from './interceptors/logger.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const environment = configService.get('NODE_ENV');
  const redisURI = configService.get('REDIS_URI');
  const redisPrefix = configService.get('REDIS_PREFIX');
  const secret = configService.get('APP_SECRET');

  const isProduction = environment === 'production';

  const logLevels: LogLevel[] = isProduction
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'verbose', 'debug'];

  app.useLogger(logLevels);

  const client = redis.createClient({ url: redisURI });

  await client.connect();

  const redisStore = new RedisStore({
    client,
    prefix: redisPrefix,
  });

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(new RequestLoggerInterceptor());

  app.use(
    session({
      store: redisStore,
      secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600000 * 24 * 14,
        secure: isProduction,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}

bootstrap();

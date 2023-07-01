import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'process';

const env = process.env;

const getDatabaseConfig = () => {
  const dbConfig = {
    synchronize: true,
    migrations: ['migrations/*.js'],
    cli: {
      migrationsDir: 'migrations',
    },
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(dbConfig, {
        type: 'postgres',
        host: env.DB_HOST,
        port: +env.DB_PORT || 5432,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
        keepConnectionAlive: true,
        entities: ['**/*.entity.js'],
      });
      break;
    case 'test':
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'test.sqlite',
        entities: ['**/*.entity.ts'],
        migrationsRun: true,
      });
      break;
    case 'production':
      Object.assign(dbConfig, {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        synchronize: false,
        entities: ['**/*.entity.js'],
        ssl: {
          rejectUnauthorized: false,
        },
      });
      break;
    default:
      throw new Error('unknown environment');
  }

  return dbConfig;
};

export const appSetup = () => ({
  port: Number(env.PORT),
  database: getDatabaseConfig() as TypeOrmModuleOptions,
});

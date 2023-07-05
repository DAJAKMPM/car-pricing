import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const env = process.env;

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: env.DB_HOST,
  port: +env.DB_PORT || 5432,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  entities: ['dist/**/**/*.entity.js'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

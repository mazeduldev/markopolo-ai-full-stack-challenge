import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config(); // Load .env file

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'pguser',
  password: process.env.DB_PASSWORD || 'pgpassword',
  database: process.env.DB_NAME || 'markopolo',
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
};

export const appDataSource = new DataSource(dataSourceOptions);

export default appDataSource;

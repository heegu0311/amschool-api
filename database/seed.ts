import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });

import { DataSource } from 'typeorm';
import { runSeeds } from './seeds';
import { config } from '../src/config/configuration';

const dataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});

async function bootstrap() {
  try {
    await dataSource.initialize();
    await runSeeds(dataSource);
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

bootstrap();

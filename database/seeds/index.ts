import { DataSource } from 'typeorm';
import { seedSectionPrimary } from './section-primary.seed';
import { seedSectionSecondary } from './section-secondary.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    await seedSectionPrimary(dataSource);
    await seedSectionSecondary(dataSource);
    console.log('Seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    throw error;
  }
}

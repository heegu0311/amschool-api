import { DataSource } from 'typeorm';
import { seedCancer } from './cancer.seed';
import { seedSectionPrimary } from './section-primary.seed';
import { seedSectionSecondary } from './section-secondary.seed';
import { seedSurveyAnswer } from './survey-answer.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    await seedCancer(dataSource);
    await seedSurveyAnswer(dataSource);
    await seedSectionPrimary(dataSource);
    await seedSectionSecondary(dataSource);
    console.log('Seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    throw error;
  }
}

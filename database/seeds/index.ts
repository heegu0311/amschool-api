import { DataSource } from 'typeorm';
import { seedCancer } from './cancer.seed';
import { seedEmotion } from './emotion.seed';
import { seedSectionPrimary } from './section-primary.seed';
import { seedSectionSecondary } from './section-secondary.seed';
import { seedSurveyAnswer } from './survey-answer.seed';
import { seedReaction } from './reaction.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    await seedCancer(dataSource);
    await seedEmotion(dataSource);
    await seedReaction(dataSource);
    await seedSurveyAnswer(dataSource);
    await seedSectionPrimary(dataSource);
    await seedSectionSecondary(dataSource);
    console.log('Seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    throw error;
  }
}

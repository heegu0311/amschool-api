import { SurveyAnswer } from 'src/survey-answer/entities/survey-answer.entity';
import { DataSource } from 'typeorm';
export const surveyAnswerSeeds = [
  {
    id: 1,
    value: 'medical_info',
    answer: '정확하고 믿을 수 있는 의료 정보',
    emoji: '💝',
  },
  {
    id: 2,
    value: 'communication',
    answer: '같은 경험을 한 사람들과의 공감과 소통',
    emoji: '💭',
  },
  {
    id: 3,
    value: 'recovery_space',
    answer: '내 마음과 회복 과정을 정리할 수 있는 공간',
    emoji: '✍️',
  },
  {
    id: 4,
    value: 'life_meaning',
    answer: '삶의 의미를 찾고 용기를 얻는 콘텐츠',
    emoji: '💗',
  },
  {
    id: 5,
    value: 'not_sure',
    answer: '잘 모르겠음',
    emoji: '💭',
  },
];

export async function seedSurveyAnswer(dataSource: DataSource) {
  const repository = dataSource.getRepository(SurveyAnswer);

  for (const seed of surveyAnswerSeeds) {
    const existing = await repository.findOne({ where: { id: seed.id } });
    if (!existing) {
      await repository.save(seed);
    }
  }
}

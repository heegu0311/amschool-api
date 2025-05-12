import { DataSource } from 'typeorm';
import { SectionPrimary } from '../../src/section_primary/entities/section_primary.entity';

export const sectionPrimarySeeds = [
  {
    id: 4,
    code: 'S1N4',
    name: 'Q&A',
  },
  {
    id: 5,
    code: 'S1N5',
    name: 'NEWS',
  },
  {
    id: 6,
    code: 'S1N6',
    name: '6대암',
  },
  {
    id: 7,
    code: 'S1N7',
    name: '기타암',
  },
  {
    id: 8,
    code: 'S1N8',
    name: '부작용',
  },
  {
    id: 11,
    code: 'S1N11',
    name: '해외자료',
  },
  {
    id: 12,
    code: 'S1N12',
    name: '암과 생활',
  },
  {
    id: 13,
    code: 'S1N13',
    name: '완치 in talk',
  },
  {
    id: 14,
    code: 'S1N14',
    name: '암스쿨TV',
  },
];

export async function seedSectionPrimary(dataSource: DataSource) {
  const repository = dataSource.getRepository(SectionPrimary);

  for (const seed of sectionPrimarySeeds) {
    const existing = await repository.findOne({ where: { id: seed.id } });
    if (!existing) {
      await repository.save(seed);
    }
  }
}

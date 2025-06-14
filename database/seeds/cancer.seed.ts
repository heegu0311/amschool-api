import { Cancer } from 'src/cancer/entities/cancer.entity';
import { DataSource } from 'typeorm';

export const cancerSeeds = [
  { id: 1, name: '갑상선암' },
  { id: 2, name: '유방암' },
  { id: 3, name: '폐암' },
  { id: 4, name: '대장암' },
  { id: 5, name: '위암' },
  { id: 6, name: '간암' },
  { id: 7, name: '전립선암' },
  { id: 8, name: '자궁경부암' },
  { id: 9, name: '방광암' },
  { id: 10, name: '기타 암' },
  { id: 11, name: '일반건강' },
];

export async function seedCancer(dataSource: DataSource) {
  const repository = dataSource.getRepository(Cancer);

  for (const seed of cancerSeeds) {
    const existing = await repository.findOne({ where: { id: seed.id } });
    if (!existing) {
      await repository.save(seed);
    }
  }
}

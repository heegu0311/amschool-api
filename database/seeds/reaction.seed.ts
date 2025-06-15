import { Reaction } from '../../src/reaction/entities/reaction.entity';
import { DataSource } from 'typeorm';

export const reactionsSeeds = [
  {
    id: 1,
    name: '좋아요',
    emoji: '👍',
  },
  {
    id: 2,
    name: '응원해요',
    emoji: '💪🏻',
  },
  {
    id: 3,
    name: '공감돼요',
    emoji: '❤️',
  },
];

export async function seedReaction(dataSource: DataSource) {
  const repository = dataSource.getRepository(Reaction);

  for (const seed of reactionsSeeds) {
    const existing = await repository.findOne({ where: { id: seed.id } });
    if (!existing) {
      await repository.save(seed);
    }
  }
}

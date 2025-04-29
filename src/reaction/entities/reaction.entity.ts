import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ReactionEntity } from '../../reaction-entity/entities/reaction-entity.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  emoji: string;

  @ManyToOne(() => ReactionEntity, (reactionEntity) => reactionEntity.reaction)
  reactionEntities: Relation<ReactionEntity[]>;
}

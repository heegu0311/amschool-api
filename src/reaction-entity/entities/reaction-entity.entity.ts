import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { Reply } from '../../comment/reply/entities/reply.entity';
import { Diary } from '../../diary/entities/diary.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../post/entities/post.entity';
@Entity()
export class ReactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['diary', 'comment', 'reply'],
    comment: '공감 대상 엔티티 타입',
    name: 'entity_type',
  })
  entityType: 'diary' | 'comment' | 'reply';

  @Column({ name: 'entity_id' })
  entityId: number;

  @Column({ name: 'reaction_id' })
  reactionId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @OneToMany(() => Reaction, (reaction) => reaction.reactionEntities)
  @JoinColumn({ name: 'reaction_id' })
  reaction: Relation<Reaction>;

  @ManyToOne(() => Diary, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'entity_id' })
  entity: Relation<Diary | Post>;

  @ManyToOne(() => Comment, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'entity_id' })
  comment: Relation<Comment>;

  @ManyToOne(() => Reply, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'entity_id' })
  reply: Relation<Reply>;
}

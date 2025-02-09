import {
  Entity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import type { Reply } from './reply.entity';

@Entity()
export class ReplyLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'replyLikes')
  user: User;

  @ManyToOne('Reply', 'likes')
  reply: Reply;

  @CreateDateColumn()
  createdAt: Date;
}

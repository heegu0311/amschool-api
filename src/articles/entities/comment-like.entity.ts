import {
  Entity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import type { Comment } from './comment.entity';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'commentLikes')
  user: User;

  @ManyToOne('Comment', 'likes')
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { ReplyLike } from './reply-like.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne('Comment', (comment: Comment) => comment.replies, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('ReplyLike', 'reply')
  likes: ReplyLike[];
}

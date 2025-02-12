import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ArticleLike } from '../../articles/entities/article-like.entity';
import type { CommentLike } from '../../articles/entities/comment-like.entity';
import type { ReplyLike } from '../../articles/entities/reply-like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  username: string;

  @Column()
  password: string;

  @Column({ length: 60 })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('ArticleLike', 'user')
  articleLikes: ArticleLike[];

  @OneToMany('CommentLike', 'user')
  commentLikes: CommentLike[];

  @OneToMany('ReplyLike', 'user')
  replyLikes: ReplyLike[];
}

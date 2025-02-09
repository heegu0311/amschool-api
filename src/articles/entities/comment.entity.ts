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
import { Article } from './article.entity';
import { Reply } from './reply.entity';
import { CommentLike } from './comment-like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne('Article', (article: Article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @OneToMany('Reply', (reply: Reply) => reply.comment)
  replies: Reply[];

  @OneToMany('CommentLike', 'comment')
  likes: CommentLike[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

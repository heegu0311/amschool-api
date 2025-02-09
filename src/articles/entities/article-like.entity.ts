import {
  Entity,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from '../../users/entities/user.entity';
import type { Article } from './article.entity';

@Entity()
export class ArticleLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'articleLikes')
  user: User;

  @ManyToOne('Article', 'likes')
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AiAnswer } from './ai-answer.entity';
import { Image } from '../../common/entities/image.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author_id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: ['public', 'private'], default: 'private' })
  access_level: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;

  @OneToOne(() => AiAnswer, (aiAnswer) => aiAnswer.question, {
    cascade: true,
  })
  aiAnswer: Relation<AiAnswer>;

  @OneToMany(() => Image, (image) => image.question)
  images: Relation<Image[]>;
}

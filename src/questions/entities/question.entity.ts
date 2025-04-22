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
  authorId: number;

  @Column({ nullable: true })
  questionSummary: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: ['public', 'private'], default: 'private' })
  accessLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'authorId' })
  author: Relation<User>;

  @OneToOne(() => AiAnswer, (aiAnswer) => aiAnswer.question, {
    cascade: true,
  })
  aiAnswer: Relation<AiAnswer>;

  @OneToMany(() => Image, (image) => image.question)
  images: Relation<Image[]>;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class AiAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  questionId: number;

  @Column({ type: 'float', nullable: true })
  feedbackPoint: number;

  @Column('text', { nullable: true })
  notice: string;

  @Column({ nullable: true })
  language: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Question, (question) => question.aiAnswer)
  @JoinColumn({ name: 'question_id' })
  question: Relation<Question>;
}

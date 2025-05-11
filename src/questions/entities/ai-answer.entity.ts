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

  @Column('text', { name: 'content' })
  content: string;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ type: 'float', default: 0, name: 'feedback_point' })
  feedbackPoint: number;

  @Column('text', { nullable: true, name: 'notice' })
  notice: string;

  @Column({ nullable: true, name: 'language' })
  language: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToOne(() => Question, (question) => question.aiAnswer)
  @JoinColumn({ name: 'question_id' })
  question: Relation<Question>;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class AiAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column()
  question_id: number;

  @Column({ type: 'float', nullable: true })
  feedback_point: number;

  @Column('text', { nullable: true })
  notice: string;

  @Column({ nullable: true })
  language: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Question, (question) => question.aiAnswer)
  @JoinColumn({ name: 'question_id' })
  question: Relation<Question>;
}

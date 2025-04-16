import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
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

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Question, (question) => question.aiAnswer)
  @JoinColumn({ name: 'question_id' })
  question: Promise<Question>;
}

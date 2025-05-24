import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { SurveyAnswer } from '../../survey-answer/entities/survey-answer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('survey_answer_user')
export class SurveyAnswerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'survey_answer_id' })
  surveyAnswerId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.surveyAnswerUsers, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(
    () => SurveyAnswer,
    (surveyAnswer: SurveyAnswer) => surveyAnswer.surveyAnswerUsers,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'survey_answer_id' })
  surveyAnswer: Relation<SurveyAnswer>;
}

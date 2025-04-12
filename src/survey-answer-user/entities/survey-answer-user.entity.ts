import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SurveyAnswer } from '../../survey-answer/entities/survey-answer.entity';

@Entity('survey_answer_user')
export class SurveyAnswerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.surveyAnswerUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @ManyToOne(
    () => SurveyAnswer,
    (surveyAnswer) => surveyAnswer.surveyAnswerUsers,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'survey_answer_id' })
  surveyAnswer: Promise<SurveyAnswer>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

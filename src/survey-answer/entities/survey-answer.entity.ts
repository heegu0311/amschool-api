import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { SurveyAnswerUser } from '../../survey-answer-user/entities/survey-answer-user.entity';

@Entity('survey_answer')
export class SurveyAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'value' })
  value: string;

  @Column({ name: 'answer' })
  answer: string;

  @Column({ name: 'emoji' })
  emoji: string;

  @OneToMany(
    () => SurveyAnswerUser,
    (surveyAnswerUser) => surveyAnswerUser.surveyAnswer,
  )
  surveyAnswerUsers: Relation<SurveyAnswerUser[]>;
}

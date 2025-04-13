import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SurveyAnswerUser } from '../../survey-answer-user/entities/survey-answer-user.entity';

@Entity('survey_answer')
export class SurveyAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  answer: string;

  @Column()
  emoji: string;

  @OneToMany(
    () => SurveyAnswerUser,
    (surveyAnswerUser) => surveyAnswerUser.surveyAnswer,
  )
  surveyAnswerUsers: Promise<SurveyAnswerUser[]>;
}

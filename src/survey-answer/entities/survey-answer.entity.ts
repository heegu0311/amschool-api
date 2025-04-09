import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('survey_answer')
export class SurveyAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  user_id: number;

  @OneToOne('User', 'surveyAnswer')
  @JoinColumn({ name: 'user_id' })
  user: any;
}

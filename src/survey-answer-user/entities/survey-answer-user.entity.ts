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
import { Expose } from 'class-transformer';
import { SurveyAnswer } from '../../survey-answer/entities/survey-answer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('survey_answer_user')
export class SurveyAnswerUser {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ name: 'user_id' })
  userId: number;

  @Expose()
  @Column({ name: 'survey_answer_id' })
  surveyAnswerId: number;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Expose()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Expose()
  @ManyToOne(() => User, (user) => user.surveyAnswerUsers, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Expose()
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

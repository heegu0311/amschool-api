import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';
import { SurveyAnswerUser } from '../../survey-answer-user/entities/survey-answer-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  provider: string;

  @Column()
  @Column({ type: 'enum', enum: ['patient', 'supporter'] })
  user_type: 'patient' | 'supporter';

  @Column({ length: 30 })
  username: string;

  @Column({ type: 'enum', enum: ['default', 'upload'] })
  profile_type: 'default' | 'upload';

  @Column()
  profile_image: string;

  @Column()
  intro: string;

  @Column({ default: false })
  is_public: boolean;

  @Column()
  signin_provider: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CancerUser, (cancerUser) => cancerUser.user, {
    lazy: true,
  })
  cancerUsers: Promise<CancerUser[]>;

  @OneToMany(
    () => SurveyAnswerUser,
    (surveyAnswerUser) => surveyAnswerUser.user,
    {
      lazy: true,
    },
  )
  surveyAnswerUsers: Promise<SurveyAnswerUser[]>;
}

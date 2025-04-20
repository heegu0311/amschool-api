import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  Relation,
} from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';
import { SurveyAnswerUser } from '../../survey-answer-user/entities/survey-answer-user.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  provider: string;

  @Column({ type: 'enum', enum: ['patient', 'supporter'] })
  userType: 'patient' | 'supporter';

  @Column({ length: 30 })
  username: string;

  @Column({ type: 'enum', enum: ['default', 'upload'] })
  profileType: 'default' | 'upload';

  @Column()
  profileImage: string;

  @Column()
  intro: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column()
  signinProvider: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CancerUser, (cancerUser: CancerUser) => cancerUser.user)
  cancerUsers: Relation<CancerUser[]>;

  @OneToMany(
    () => SurveyAnswerUser,
    (surveyAnswerUser: SurveyAnswerUser) => surveyAnswerUser.user,
  )
  surveyAnswerUsers: Relation<SurveyAnswerUser[]>;

  @OneToOne(() => RefreshToken)
  refreshToken: Relation<RefreshToken>;
}

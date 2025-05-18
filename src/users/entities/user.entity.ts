import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Reply } from '../../comment/reply/entities/reply.entity';
import { SurveyAnswerUser } from '../../survey-answer-user/entities/survey-answer-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true, name: 'email' })
  email: string;

  @Column({ nullable: true, name: 'password' })
  password: string;

  @Column({ type: 'date', nullable: true, name: 'birthday' })
  birthday: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true, name: 'provider' })
  provider: string;

  @Column({
    type: 'enum',
    enum: ['patient', 'supporter'],
    name: 'user_type',
  })
  userType: 'patient' | 'supporter';

  @Column({ length: 30, name: 'username' })
  username: string;

  @Column({ type: 'enum', enum: ['default', 'upload'], name: 'profile_type' })
  profileType: 'default' | 'upload';

  @Column({ name: 'profile_image' })
  profileImage: string;

  @Column({ name: 'intro' })
  intro: string;

  @Column({ type: 'enum', enum: ['M', 'F'], nullable: true, name: 'gender' })
  gender: 'M' | 'F';

  @Column({ default: false, name: 'is_public' })
  isPublic: boolean;

  @Column({ name: 'signin_provider' })
  signinProvider: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CancerUser, (cancerUser: CancerUser) => cancerUser.user)
  cancerUsers: Relation<CancerUser[]>;

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  comments: Relation<Comment[]>;

  @OneToMany(() => Reply, (reply: Reply) => reply.author)
  replies: Relation<Reply[]>;

  @OneToMany(
    () => SurveyAnswerUser,
    (surveyAnswerUser: SurveyAnswerUser) => surveyAnswerUser.user,
  )
  surveyAnswerUsers: Relation<SurveyAnswerUser[]>;

  @OneToOne(() => RefreshToken)
  refreshToken: Relation<RefreshToken>;
}

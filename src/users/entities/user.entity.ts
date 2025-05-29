import { customAlphabet } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Reply } from '../../comment/reply/entities/reply.entity';
import { Gender } from '../../common/enums/gender.enum';
import { Notification } from '../../notification/entities/notification.entity';
import { SurveyAnswerUser } from '../../survey-answer-user/entities/survey-answer-user.entity';

// 1부터 시작하는 10자리 숫자 ID 생성
const nanoid = customAlphabet('123456789', 9);

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      // 1로 시작하는 10자리 숫자 생성
      this.id = parseInt('1' + nanoid(), 10);
    }
  }

  @Column({ length: 60, name: 'email' })
  email: string;

  @Column({ nullable: true, name: 'password' })
  password: string;

  @Column({ type: 'date', nullable: true, name: 'birthday' })
  birthday: Date;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ default: false, name: 'is_admin' })
  isAdmin: boolean;

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

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    name: 'gender',
  })
  gender: Gender;

  @Column({ default: false, name: 'is_public' })
  isPublic: boolean;

  @Column({ name: 'signin_provider' })
  signinProvider: string;

  @Column({ default: false, name: 'agree_service' })
  agreeService: boolean;

  @Column({ default: false, name: 'agree_privacy' })
  agreePrivacy: boolean;

  @Column({ default: false, name: 'agree_marketing' })
  agreeMarketing: boolean;

  @Column({ nullable: true, name: 'social_id' })
  socialId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CancerUser, (cancerUser: CancerUser) => cancerUser.user, {
    onDelete: 'CASCADE',
  })
  cancerUsers: Relation<CancerUser[]>;

  @OneToMany(() => Comment, (comment: Comment) => comment.author, {
    onDelete: 'CASCADE',
  })
  comments: Relation<Comment[]>;

  @OneToMany(() => Reply, (reply: Reply) => reply.author, {
    onDelete: 'CASCADE',
  })
  replies: Relation<Reply[]>;

  @OneToMany(
    () => SurveyAnswerUser,
    (surveyAnswerUser: SurveyAnswerUser) => surveyAnswerUser.user,
    {
      onDelete: 'CASCADE',
    },
  )
  surveyAnswerUsers: Relation<SurveyAnswerUser[]>;

  @OneToMany(
    () => RefreshToken,
    (refreshToken: RefreshToken) => refreshToken.user,
    {
      onDelete: 'CASCADE',
    },
  )
  refreshTokens: Relation<RefreshToken[]>;

  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.sender,
    {
      onDelete: 'CASCADE',
    },
  )
  notifications: Relation<Notification[]>;
}

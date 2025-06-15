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
import { Exclude, Expose, Type } from 'class-transformer';
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
  @Expose()
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      // 1로 시작하는 10자리 숫자 생성
      this.id = parseInt('1' + nanoid(), 10);
    }
  }

  @Expose()
  @Column({ length: 60, name: 'email' })
  email: string;

  @Exclude()
  @Column({ nullable: true, name: 'password', select: false })
  password: string;

  @Expose()
  @Column({ type: 'date', nullable: true, name: 'birthday' })
  birthday: Date;

  @Expose()
  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Expose()
  @Column({ default: false, name: 'is_admin' })
  isAdmin: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: ['patient', 'supporter'],
    name: 'user_type',
  })
  userType: 'patient' | 'supporter';

  @Expose()
  @Column({ length: 30, name: 'username' })
  username: string;

  @Expose()
  @Column({ type: 'enum', enum: ['default', 'upload'], name: 'profile_type' })
  profileType: 'default' | 'upload';

  @Expose()
  @Column({ name: 'profile_image' })
  profileImage: string;

  @Expose()
  @Column({ name: 'intro' })
  intro: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
    name: 'gender',
  })
  gender: Gender;

  @Expose()
  @Column({ default: false, name: 'is_public' })
  isPublic: boolean;

  @Expose()
  @Column({ name: 'signin_provider' })
  signinProvider: string;

  @Expose()
  @Column({ default: false, name: 'agree_service' })
  agreeService: boolean;

  @Expose()
  @Column({ default: false, name: 'agree_privacy' })
  agreePrivacy: boolean;

  @Expose()
  @Column({ default: false, name: 'agree_marketing' })
  agreeMarketing: boolean;

  @Expose()
  @Column({ nullable: true, name: 'social_id' })
  socialId: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Expose()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Expose()
  @Type(() => CancerUser)
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

  @Expose()
  @Type(() => SurveyAnswerUser)
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

  static getSelectFields(alias: string = 'user'): string[] {
    const fields = [
      'id',
      'email',
      'birthday',
      'isActive',
      'isAdmin',
      'provider',
      'userType',
      'username',
      'profileType',
      'profileImage',
      'intro',
      'gender',
      'isPublic',
      'signinProvider',
      'agreeService',
      'agreePrivacy',
      'agreeMarketing',
      'socialId',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'cancerUsers',
    ];

    return fields.map((field) => `${alias}.${field}`);
  }
}

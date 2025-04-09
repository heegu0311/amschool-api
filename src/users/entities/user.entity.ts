import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column()
  user_type: string;

  @Column()
  profile: string;

  @Column()
  nickname: string;

  @Column()
  intro: string;

  @Column({ default: false })
  is_cancer_public: boolean;

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

  @OneToOne('SurveyAnswer', 'user')
  surveyAnswer: any;
}

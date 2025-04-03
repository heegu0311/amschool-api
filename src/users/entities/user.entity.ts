import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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

  @Column({ nullable: true })
  survey_answer_id: number;

  @OneToMany(() => CancerUser, (cancerUser) => cancerUser.user, {
    lazy: true,
  })
  cancerUsers: Promise<CancerUser[]>;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'token' })
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ default: false, name: 'is_revoked' })
  isRevoked: boolean;

  @ManyToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}

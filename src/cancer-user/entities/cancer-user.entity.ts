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
import { Cancer } from '../../cancer/entities/cancer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cancer_user')
export class CancerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'cancer_id' })
  cancerId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.cancerUsers, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Cancer, (cancer) => cancer.cancerUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cancer_id' })
  cancer: Relation<Cancer>;
}

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
import { Cancer } from '../../cancer/entities/cancer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cancer_user')
export class CancerUser {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ name: 'user_id' })
  userId: number;

  @Expose()
  @Column({ name: 'cancer_id' })
  cancerId: number;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Expose()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Expose()
  @ManyToOne(() => User, (user) => user.cancerUsers, {
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Expose()
  @ManyToOne(() => Cancer, (cancer) => cancer.cancerUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cancer_id' })
  cancer: Relation<Cancer>;
}

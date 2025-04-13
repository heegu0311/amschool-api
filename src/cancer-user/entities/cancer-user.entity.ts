import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Cancer } from '../../cancer/entities/cancer.entity';

@Entity()
export class CancerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  cancerId: number;

  @ManyToOne(() => User, (user) => user.cancerUsers, {
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @ManyToOne(() => Cancer, (cancer) => cancer.cancerUsers, {
    lazy: true,
  })
  @JoinColumn({ name: 'cancer_id' })
  cancer: Promise<Cancer>;
}

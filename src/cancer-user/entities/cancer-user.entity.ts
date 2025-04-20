import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Cancer } from '../../cancer/entities/cancer.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class CancerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  cancerId: number;

  @ManyToOne(() => User, (user) => user.cancerUsers)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Cancer, (cancer) => cancer.cancerUsers)
  @JoinColumn({ name: 'cancer_id' })
  cancer: Relation<Cancer>;
}

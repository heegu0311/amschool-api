import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';

@Entity()
export class Cancer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => CancerUser, (cancerUser) => cancerUser.cancer)
  cancerUsers: Relation<CancerUser[]>;
}

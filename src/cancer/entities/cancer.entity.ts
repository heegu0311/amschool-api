import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Cancer {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => CancerUser, (cancerUser) => cancerUser.cancer)
  cancerUsers: Relation<CancerUser[]>;
}

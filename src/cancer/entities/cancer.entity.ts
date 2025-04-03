import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CancerUser } from '../../cancer-user/entities/cancer-user.entity';

@Entity()
export class Cancer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => CancerUser, (cancerUser) => cancerUser.cancer, {
    lazy: true,
  })
  cancerUsers: Promise<CancerUser[]>;
}

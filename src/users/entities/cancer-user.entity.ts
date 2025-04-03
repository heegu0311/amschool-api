import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Cancer } from 'src/cancer/entities/cancer.entity';
@Entity()
export class CancerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cancerUsers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Cancer, (cancer) => cancer.cancerUsers)
  @JoinColumn({ name: 'cancer_id' })
  cancer: Cancer;
}

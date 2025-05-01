import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Emotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  imageUrl: string;

  @Column()
  order: number;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Emotion, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Emotion;

  @OneToMany(() => Emotion, (emotion) => emotion.parent)
  children: Emotion[];
}

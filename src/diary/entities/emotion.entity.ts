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

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'code' })
  code: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'order' })
  order: number;

  @Column({ nullable: true, name: 'parent_id' })
  parentId: number;

  @ManyToOne(() => Emotion, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Emotion;

  @OneToMany(() => Emotion, (emotion) => emotion.parent)
  children: Emotion[];
}

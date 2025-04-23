import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Emotion } from './emotion.entity';

@Entity()
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  emotionId: number;

  @Column({ nullable: true })
  subEmotionId: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 'public' })
  accessLevel: 'public' | 'private';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => Emotion)
  @JoinColumn({ name: 'emotion_id' })
  emotion: Emotion;

  @ManyToOne(() => Emotion)
  @JoinColumn({ name: 'sub_emotion_id' })
  subEmotion: Emotion;
}

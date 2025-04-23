import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Emotion } from './emotion.entity';
import { Image } from '../../common/entities/image.entity';

@Entity()
export class Diary {
  @ApiProperty({ description: '일기 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '작성자 ID' })
  @Column()
  authorId: number;

  @ApiProperty({ description: '제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '내용' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '감정 ID', required: false })
  @Column()
  emotionId: number;

  @ApiProperty({ description: '부감정 ID', required: false })
  @Column()
  subEmotionId: number;

  @ApiProperty({ description: '작성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;

  @OneToOne(() => Emotion, (emotion) => emotion.id)
  @JoinColumn({ name: 'emotion_id' })
  emotion: Relation<Emotion>;

  @OneToOne(() => Emotion, (emotion) => emotion.id)
  @JoinColumn({ name: 'sub_emotion_id' })
  subEmotion: Relation<Emotion>;

  @OneToMany(() => Image, (image) => image.diary)
  images: Relation<Image[]>;
}

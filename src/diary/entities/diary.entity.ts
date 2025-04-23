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
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Emotion } from './emotion.entity';

@Entity()
export class Diary {
  @ApiProperty({ description: '일기 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '작성자 ID' })
  @Column()
  authorId: number;

  @ApiProperty({ description: '감정 ID' })
  @Column()
  emotionId: number;

  @ApiProperty({ description: '세부 감정 ID', required: false })
  @Column({ nullable: true })
  subEmotionId: number;

  @ApiProperty({ description: '일기 내용' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '썸네일 URL', required: false })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({
    description: '접근 권한',
    enum: ['public', 'private'],
    default: 'public',
  })
  @Column({ default: 'public' })
  accessLevel: 'public' | 'private';

  @ApiProperty({ description: '생성일시' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일시' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '삭제일시', required: false })
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ApiProperty({ type: () => Emotion })
  @ManyToOne(() => Emotion)
  @JoinColumn({ name: 'emotionId' })
  emotion: Emotion;

  @ApiProperty({ type: () => Emotion, required: false })
  @ManyToOne(() => Emotion)
  @JoinColumn({ name: 'subEmotionId' })
  subEmotion: Emotion;
}

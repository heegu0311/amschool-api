import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { Image } from '../../common/entities/image.entity';
import { ReactionEntity } from '../../reaction-entity/entities/reaction-entity.entity';
import { User } from '../../users/entities/user.entity';
import { Emotion } from './emotion.entity';

@Entity()
export class Diary {
  @ApiProperty({ description: '오늘의나 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '오늘의나 타입' })
  @Column({ default: 'diary', name: 'type' })
  type: string;

  @ApiProperty({ description: '작성자 ID' })
  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({ description: '내용' })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({ description: '접근 권한' })
  @Column({ default: 'public', name: 'access_level' })
  accessLevel: 'public' | 'member' | 'private';

  @ApiProperty({ description: '감정 ID', required: false })
  @Column({ name: 'emotion_id' })
  emotionId: number;

  @ApiProperty({ description: '부감정 ID', required: false })
  @Column({ name: 'sub_emotion_id' })
  subEmotionId: number;

  @ApiProperty({ description: '작성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Emotion, (emotion) => emotion.id)
  @JoinColumn({ name: 'emotion_id' })
  emotion: Relation<Emotion>;

  @ManyToOne(() => Emotion, (emotion) => emotion.id)
  @JoinColumn({ name: 'sub_emotion_id' })
  subEmotion: Relation<Emotion>;

  @OneToMany(() => Image, (image) => image.entity)
  images: Relation<Image[]>;

  @OneToMany(() => Comment, (comment) => comment.diary)
  comments: Relation<Comment[]>;

  @OneToMany(() => ReactionEntity, (reactionEntity) => reactionEntity.entity)
  reactions: Relation<ReactionEntity[]>;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;
}

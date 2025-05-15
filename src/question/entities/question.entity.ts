import { ApiProperty } from '@nestjs/swagger';
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
import { Image } from '../../common/entities/image.entity';
import { User } from '../../users/entities/user.entity';
import { AiAnswer } from './ai-answer.entity';
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '질문 타입', example: 'question' })
  @Column({ default: 'question', name: 'type' })
  type: string;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ nullable: true, name: 'question_summary' })
  questionummary: string;

  @Column('text', { name: 'content' })
  content: string;

  @Column({
    type: 'enum',
    enum: ['public', 'private'],
    default: 'private',
    name: 'access_level',
  })
  accessLevel: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;

  @OneToOne(() => AiAnswer, (aiAnswer) => aiAnswer.question, {
    cascade: true,
  })
  aiAnswer: Relation<AiAnswer>;

  @OneToMany(() => Image, (image) => image.entity)
  images: Relation<Image[]>;
}

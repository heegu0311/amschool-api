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
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '질문 타입', example: 'question' })
  @Column({ default: 'question' })
  type: string;

  @Column()
  authorId: number;

  @Column({ nullable: true })
  questionSummary: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: ['public', 'private'], default: 'private' })
  accessLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
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

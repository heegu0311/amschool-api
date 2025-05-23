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
import { Diary } from '../../diary/entities/diary.entity';
import { ReactionEntity } from '../../reaction-entity/entities/reaction-entity.entity';
import { User } from '../../users/entities/user.entity';
import { Reply } from '../reply/entities/reply.entity';
import { Post } from '../../post/entities/post.entity';
@Entity()
export class Comment {
  @ApiProperty({ description: '댓글 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '댓글 타입', example: 'comment' })
  @Column({ default: 'comment', name: 'type' })
  type: string;

  @ApiProperty({ description: '댓글 내용', example: '좋은 글 감사합니다!' })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({ description: '작성자 ID', example: 1 })
  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({
    description: '엔티티 타입',
    example: 'diary',
    enum: ['diary', 'question', 'post'],
  })
  @Column({ name: 'entity_type' })
  entityType: string;

  @ApiProperty({ description: '엔티티 ID', example: 1 })
  @Column({ name: 'entity_id' })
  entityId: number;

  @ApiProperty({ description: '엔티티 정보' })
  @ManyToOne(() => Diary, (diary) => diary.comments)
  @JoinColumn({
    name: 'entity_id',
    referencedColumnName: 'id',
  })
  entity: Relation<Diary | Post>;

  @ManyToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;

  @OneToMany(() => Reply, (reply) => reply.comment)
  replies: Relation<Reply[]>;

  @OneToMany(() => ReactionEntity, (reactionEntity) => reactionEntity.comment)
  reactions: Relation<ReactionEntity[]>;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제일', required: false })
  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { ReactionEntity } from '../../../reaction-entity/entities/reaction-entity.entity';
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
import { Comment } from '../../entities/comment.entity';

@Entity()
export class Reply {
  @ApiProperty({ description: '답글 ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '답글 내용', example: '좋은 글 감사합니다!' })
  @Column('text')
  content: string;

  @ApiProperty({ description: '작성자 ID', example: 1 })
  @Column()
  authorId: number;

  @ApiProperty({
    description: '엔티티 타입',
    example: 'diary',
    enum: ['diary', 'question', 'post'],
  })
  @Column()
  entityType: string;

  @ApiProperty({ description: '엔티티 ID', example: 1 })
  @Column()
  entityId: number;

  @ApiProperty({ description: '댓글 ID', example: 1 })
  @Column()
  commentId: number;

  @ApiProperty({ description: '댓글 정보' })
  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({
    name: 'comment_id',
    referencedColumnName: 'id',
  })
  comment: Relation<Comment>;

  @OneToMany(() => ReactionEntity, (reactionEntity) => reactionEntity.reply)
  reactions: Relation<ReactionEntity[]>;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '삭제일', required: false })
  @DeleteDateColumn()
  deletedAt: Date;
}

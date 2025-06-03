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

@Entity()
export class Post {
  @ApiProperty({ description: '게시글 ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '게시글 타입' })
  @Column({ default: 'post', name: 'type' })
  type: string;

  @ApiProperty({
    description: '카테고리',
    enum: ['free', 'question', 'notice'],
    example: 'free',
  })
  @Column({
    type: 'enum',
    enum: ['free', 'question', 'notice'],
    default: 'free',
    name: 'category',
  })
  category: 'free' | 'question' | 'notice';

  @ApiProperty({ description: '작성자 ID' })
  @Column({ name: 'author_id' })
  authorId: number;

  @ApiProperty({ description: '제목' })
  @Column({ type: 'varchar', length: 255, name: 'title' })
  title: string;

  @ApiProperty({ description: '내용' })
  @Column('text', { name: 'content' })
  content: string;

  @ApiProperty({ description: '접근 권한' })
  @Column({ default: 'member', name: 'access_level' })
  accessLevel: 'public' | 'member' | 'private';

  @ApiProperty({ description: '조회수', default: 0 })
  @Column({ type: 'int', default: 0, name: 'view_count' })
  viewCount: number;

  @ApiProperty({ description: '작성일' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: '삭제일' })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => Image, (image) => image.entity)
  images: Relation<Image[]>;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Relation<Comment[]>;

  @OneToMany(() => ReactionEntity, (reactionEntity) => reactionEntity.entity)
  reactions: Relation<ReactionEntity[]>;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'author_id' })
  author: Relation<User>;
}

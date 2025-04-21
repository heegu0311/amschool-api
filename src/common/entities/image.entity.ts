import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { S3Service } from '../services/s3.service';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  entityType: string; // 'question', 'post', 'diary'

  @Column()
  entityId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Question, (question) => question.images)
  @JoinColumn({ name: 'entityId' })
  question: Relation<Question>;

  async getPresignedUrl(s3Service: S3Service): Promise<string> {
    const key = this.url.split('/').slice(-2).join('/'); // S3 키 추출
    return s3Service.getPresignedUrl(key);
  }
}

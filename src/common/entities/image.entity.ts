import {
  Check,
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
import { Diary } from '../../diary/entities/diary.entity';
import { Question } from '../../questions/entities/question.entity';
import { S3Service } from '../services/s3.service';

@Entity()
@Check('"order" >= 1 AND "order" <= 3')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'original_name' })
  originalName: string;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column({ name: 'size' })
  size: number;

  @Column({ name: 'entity_type' })
  entityType: string; // 'question', 'post', 'diary'

  @Column({ name: 'entity_id' })
  entityId: number;

  @Column({ type: 'int', default: 1, name: 'order' })
  order: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Question, (question) => question.images, {
    createForeignKeyConstraints: false,
  })
  @ManyToOne(() => Diary, (diary) => diary.images, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'entity_id',
    referencedColumnName: 'id',
  })
  entity: Relation<Question | Diary>;

  async getPresignedUrl(s3Service: S3Service): Promise<string> {
    const key = this.url.split('/').slice(-2).join('/'); // S3 키 추출
    return s3Service.getPresignedUrl(key);
  }
}

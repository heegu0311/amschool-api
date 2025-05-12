import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { S3Service } from 'src/common/services/s3.service';

@Entity({ name: 'article_image', comment: '기사사진' })
export class ArticleImage {
  @ApiProperty({ description: '번호', example: 1 })
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true, comment: '번호' })
  id: number;

  @ApiProperty({ description: '기사번호', example: 100 })
  @Column({
    name: 'article_id',
    type: 'int',
    unsigned: true,
    default: () => '0',
    comment: '기사번호',
  })
  articleId: number;

  @ApiProperty({ description: '기사이미지', example: 'image.jpg' })
  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 250,
    default: '',
    comment: '기사이미지',
  })
  fileName: string;

  @ApiProperty({ description: '디렉토리', example: '/2024/06/01' })
  @Column({
    name: 'file_path',
    type: 'varchar',
    length: 25,
    default: '',
    comment: '디렉토리',
  })
  filePath: string;

  @ApiProperty({ description: '제목', example: '사진 제목', required: false })
  @Column({
    name: 'image_title',
    type: 'varchar',
    length: 250,
    nullable: true,
    comment: '제목',
  })
  imageTitle?: string;

  @ApiProperty({ description: '캡션', example: '사진 설명', required: false })
  @Column({
    name: 'image_caption',
    type: 'text',
    nullable: true,
    comment: '캡션',
  })
  imageCaption?: string;

  @ApiProperty({
    description: '확장자',
    enum: ['J', 'G', 'P', 'B', 'S'],
    example: 'J',
  })
  @Column({
    name: 'image_ext',
    type: 'enum',
    enum: ['J', 'G', 'P', 'B', 'S'],
    default: 'J',
    comment: '확장자',
  })
  imageExt: 'J' | 'G' | 'P' | 'B' | 'S';

  @ApiProperty({ description: '정렬', example: 1 })
  @Column({
    name: 'image_sort',
    type: 'int',
    unsigned: true,
    default: () => '0',
    comment: '정렬',
  })
  imageSort: number;

  @ApiProperty({
    description: '대표사진',
    enum: ['Y', 'N'],
    example: 'Y',
  })
  @Column({
    name: 'is_featured',
    type: 'enum',
    enum: ['Y', 'N'],
    default: 'Y',
    comment: '대표사진',
  })
  isFeatured: 'Y' | 'N';

  @ApiProperty({
    description: '생성일',
    example: '2024-06-01T12:00:00.000Z',
    required: false,
  })
  @Column({
    name: 'created_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  createdAt?: Date;

  @ApiProperty({
    description: '수정일',
    example: '2024-06-02T13:00:00.000Z',
    required: false,
  })
  @Column({
    name: 'updated_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  updatedAt?: Date;

  @ManyToOne(() => Article, (article) => article.images)
  @JoinColumn({ name: 'article_id' })
  article: Relation<Article>;

  async getPresignedUrl(s3Service: S3Service): Promise<string> {
    const key = this.filePath.split('/').slice(-2).join('/'); // S3 키 추출
    return s3Service.getPresignedUrl(key);
  }
}

import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { SectionPrimary } from '../../section_primary/entities/section_primary.entity';
import { SectionSecondary } from '../../section_secondary/entities/section_secondary.entity';
import { ArticleImage } from '../../article-image/entities/article-image.entity';

@Entity({ name: 'article', comment: '기사' })
export class Article {
  @ApiProperty({ description: '번호', example: 1 })
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: '번호',
  })
  id: number;

  @ApiProperty({ description: '제목', example: '암 치료의 최신 동향' })
  @Column({
    type: 'varchar',
    length: 200,
    comment: '제목',
    nullable: false,
  })
  title: string;

  @ApiProperty({ description: '부제목', example: '새로운 치료법의 등장' })
  @Column({ type: 'text', nullable: true, comment: '부제목' })
  subtitle?: string;

  @ApiProperty({ description: '내용', example: '기사 본문 내용...' })
  @Column({ type: 'longtext', comment: '내용', nullable: false })
  content: string;

  @ApiProperty({ description: '영상태그', example: '<iframe ...></iframe>' })
  @Column({
    type: 'text',
    comment: '영상태그',
    name: 'video_tag',
    nullable: true,
  })
  videoTag: string;

  @ApiProperty({ description: '대표이미지', example: 'thumb001.jpg' })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '대표이미지',
    nullable: true,
  })
  thumbnail: string;

  @ApiProperty({ description: '아이디', example: 'admin01' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '아이디',
    name: 'admin_id',
  })
  adminId?: string;

  @ApiProperty({ description: '기자명', example: '홍길동' })
  @Column({
    type: 'varchar',
    length: 50,
    comment: '기자명',
    nullable: true,
  })
  author: string;

  @ApiProperty({ description: '이메일', example: 'admin@amschool.com' })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '이메일',
    name: 'admin_email',
  })
  adminEmail?: string;

  @ApiProperty({ description: '1차섹션', example: 'S1N4' })
  @Column({
    name: 'section_primary_code',
    type: 'varchar',
    length: 20,
    comment: '1차섹션',
    nullable: false,
  })
  sectionPrimaryCode: string;

  @ApiProperty({ description: '2차섹션', example: 'S2N18' })
  @Column({
    name: 'section_secondary_code',
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '2차섹션',
  })
  sectionSecondaryCode?: string;

  @ApiProperty({ description: '연재', example: 'SER001' })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '연재',
  })
  series?: string;

  @ApiProperty({
    description: '등급',
    enum: ['M', 'T', 'I', 'B'],
    example: 'B',
  })
  @Column({
    type: 'enum',
    enum: ['M', 'T', 'I', 'B'],
    nullable: true,
    comment: '등급',
    name: 'article_grade',
  })
  articleGrade?: 'M' | 'T' | 'I' | 'B';

  @ApiProperty({
    description: '기사형태',
    enum: ['B', 'P', 'C', 'N', 'M', 'G'],
    example: 'B',
  })
  @Column({
    type: 'enum',
    enum: ['B', 'P', 'C', 'N', 'M', 'G'],
    comment: '기사형태',
    name: 'article_type',
    nullable: true,
  })
  articleType: 'B' | 'P' | 'C' | 'N' | 'M' | 'G';

  @ApiProperty({ description: '조회수', example: 0 })
  @Column({
    type: 'int',
    unsigned: true,
    comment: '조회수',
    nullable: true,
  })
  views: number;

  @ApiProperty({ description: '시리얼번호', example: 0 })
  @Column({
    type: 'int',
    unsigned: true,
    comment: '시리얼번호',
    name: 'serial_number',
    nullable: true,
  })
  serialNumber: number;

  @ApiProperty({ description: '지면사용여부', enum: ['Y', 'N'], example: 'N' })
  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    comment: '지면사용여부',
    name: 'exclusive_use',
    nullable: true,
  })
  exclusiveUse: 'Y' | 'N';

  @ApiProperty({ description: '면', example: 0 })
  @Column({
    type: 'varchar',
    length: 20,
    comment: '면',
    name: 'print_page',
    nullable: true,
  })
  printPage: string;

  @ApiProperty({
    description: '상태',
    enum: ['I', 'C', 'R', 'E'],
    example: 'I',
  })
  @Column({
    type: 'enum',
    enum: ['I', 'C', 'R', 'E'],
    comment: '상태',
    nullable: true,
  })
  status: 'I' | 'C' | 'R' | 'E';

  @ApiProperty({ description: '조회등급', enum: ['A', 'M', 'C'], example: 'A' })
  @Column({
    type: 'enum',
    enum: ['A', 'M', 'C'],
    comment: '조회등급',
    name: 'view_rank',
    nullable: true,
  })
  viewRank: 'A' | 'M' | 'C';

  @ApiProperty({ description: '외부노출여부', enum: ['Y', 'N'], example: 'N' })
  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    comment: '외부노출여부',
    name: 'on_off',
    nullable: true,
  })
  onOff: 'Y' | 'N';

  @ApiProperty({ description: '온/오프', enum: ['O', 'F'], example: 'O' })
  @Column({
    type: 'enum',
    enum: ['O', 'F'],
    comment: '온/ 오프',
    name: 'external_exposure',
    nullable: true,
  })
  externalExposure: 'O' | 'F';

  @ApiProperty({ description: '발행일자', example: '2024-06-01' })
  @Column({
    type: 'date',
    comment: '발행일자',
    name: 'publish_date',
    nullable: true,
  })
  publishDate: string;

  @ApiProperty({ description: '등록일', example: '2024-06-01' })
  @Column({
    type: 'date',
    comment: '등록일',
    name: 'registration_date',
    nullable: true,
  })
  registrationDate: string;

  @ApiProperty({ description: '등록시간', example: '00:00:00' })
  @Column({
    type: 'time',
    comment: '등록시간',
    name: 'registration_time',
    nullable: true,
  })
  registrationTime: string;

  @ApiProperty({ description: '수정일', example: '2024-06-01' })
  @Column({
    type: 'date',
    nullable: true,
    comment: '수정일',
    name: 'update_date',
  })
  updateDate?: string;

  @ApiProperty({ description: '수정시간', example: '00:00:00' })
  @Column({
    type: 'time',
    nullable: true,
    comment: '수정시간',
    name: 'update_time',
  })
  updateTime?: string;

  @ApiProperty({ description: '노출', enum: ['Y', 'N'], example: 'N' })
  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    comment: '노출',
    name: 'is_visible',
    nullable: true,
  })
  isVisible: 'Y' | 'N';

  @ApiProperty({
    description: '엠바고사용여부',
    enum: ['Y', 'N'],
    example: 'N',
  })
  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    comment: '엠바고사용여부',
    name: 'mba_usage',
    nullable: true,
  })
  mbaUsage: 'Y' | 'N';

  @ApiProperty({ description: '엠바고시간', example: 0 })
  @Column({
    type: 'int',
    unsigned: true,
    comment: '엠바고시간',
    name: 'mba_end_time',
    nullable: true,
  })
  mbaEndTime: number;

  @ApiProperty({ description: '키워드', example: '암, 치료, 건강' })
  @Column({ type: 'text', comment: '키워드', nullable: true })
  keywords: string;

  @ManyToOne(() => SectionPrimary, (primary) => primary.articles)
  @JoinColumn({ name: 'section_primary_code', referencedColumnName: 'code' })
  sectionPrimary: Relation<SectionPrimary>;

  @ManyToOne(() => SectionSecondary, (secondary) => secondary.articles)
  @JoinColumn({ name: 'section_secondary_code', referencedColumnName: 'code' })
  sectionSecondary: Relation<SectionSecondary>;

  @OneToMany(() => ArticleImage, (image) => image.article)
  images: Relation<ArticleImage[]>;

  @CreateDateColumn({ name: 'created_at', comment: '등록일', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '수정일', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제일',
  })
  deletedAt: Date;
}

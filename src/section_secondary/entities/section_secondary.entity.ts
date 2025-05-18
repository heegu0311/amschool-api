import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { SectionPrimary } from '../../section_primary/entities/section_primary.entity';

@Entity({ name: 'section_secondary', comment: '기사2차섹션' })
export class SectionSecondary {
  @ApiProperty({ description: '번호', example: 1 })
  @PrimaryColumn({
    type: 'int',
    unsigned: true,
    default: () => '0',
    comment: '번호',
  })
  id: number;

  @ApiProperty({ description: '코드', example: 'SEC001' })
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: '코드',
  })
  code: string;

  @ApiProperty({ description: '섹션명', example: '정치' })
  @Column({
    type: 'varchar',
    length: 200,
    default: '',
    comment: '섹션명',
  })
  name: string;

  @ApiProperty({ description: '노출', enum: ['Y', 'N'], example: 'N' })
  @Column({
    type: 'enum',
    enum: ['Y', 'N'],
    comment: '노출',
    name: 'is_visible',
    nullable: true,
  })
  isVisible: 'Y' | 'N';

  @ApiProperty({ description: '순서', example: 1 })
  @Column({
    type: 'int',
    comment: '순서',
    name: 'order',
    nullable: true,
  })
  order: number;

  @ApiProperty({ description: '1차섹션코드', example: 'SEC001' })
  @Column({
    name: 'section_primary_code',
    type: 'varchar',
    length: 20,
    default: '',
    comment: '1차섹션코드',
  })
  sectionPrimaryCode: string;

  @ManyToOne(() => SectionPrimary, (primary) => primary.secondaries, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'section_primary_code', referencedColumnName: 'code' })
  sectionPrimary: Relation<SectionPrimary>;

  @OneToMany(() => Article, (article) => article.sectionSecondary)
  articles: Relation<Article[]>;
}

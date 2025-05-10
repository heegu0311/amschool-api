import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
  Index,
} from 'typeorm';
import { SectionPrimary } from '../../section_primary/entities/section_primary.entity';
import { Article } from '../../article/entities/article.entity';

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
    default: '',
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

  @ApiProperty({ description: '1차섹션코드', example: 'SEC001' })
  @Column({
    name: 'section_primary_code',
    type: 'varchar',
    length: 20,
    default: '',
    comment: '1차섹션코드',
  })
  sectionPrimaryCode: string;

  @ManyToOne(() => SectionPrimary, (primary) => primary.secondaries)
  @JoinColumn({ name: 'section_primary_code', referencedColumnName: 'code' })
  sectionPrimary: Relation<SectionPrimary>;

  @OneToMany(() => Article, (article) => article.sectionSecondary)
  articles: Relation<Article[]>;
}

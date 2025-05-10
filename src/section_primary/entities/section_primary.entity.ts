import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Relation,
  Index,
} from 'typeorm';
import { SectionSecondary } from '../../section_secondary/entities/section_secondary.entity';
import { Article } from '../../article/entities/article.entity';

@Entity({ name: 'section_primary', comment: '기사1차섹션' })
export class SectionPrimary {
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
  @Column({ type: 'varchar', length: 20, default: '', comment: '코드' })
  code: string;

  @ApiProperty({ description: '섹션명', example: '정치' })
  @Column({ type: 'varchar', length: 200, default: '', comment: '섹션명' })
  name: string;

  @OneToMany(() => SectionSecondary, (secondary) => secondary.sectionPrimary)
  secondaries: Relation<SectionSecondary[]>;

  @OneToMany(() => Article, (article) => article.sectionPrimary)
  articles: Relation<Article[]>;
}

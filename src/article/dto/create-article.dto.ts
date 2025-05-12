import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: '제목', required: true })
  @IsString()
  title: string;

  @ApiProperty({ description: '부제목', required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ description: '내용', required: true })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '영상태그', required: false })
  @IsOptional()
  @IsString()
  videoTag?: string;

  @ApiProperty({ description: '대표이미지', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ description: '기자명', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: '이메일', required: false })
  @IsOptional()
  @IsString()
  adminEmail?: string;

  @ApiProperty({ description: '1차섹션', required: true })
  @IsOptional()
  @IsString()
  sectionPrimaryCode?: string;

  @ApiProperty({ description: '2차섹션', required: true })
  @IsOptional()
  @IsString()
  sectionSecondaryCode?: string;

  @ApiProperty({ description: '연재', required: false })
  @IsOptional()
  @IsString()
  series?: string;

  @ApiProperty({
    description: '등급',
    enum: ['M', 'T', 'I', 'B'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['M', 'T', 'I', 'B'])
  articleGrade?: 'M' | 'T' | 'I' | 'B';

  @ApiProperty({
    description: '기사형태',
    enum: ['B', 'P', 'C', 'N', 'M', 'G'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['B', 'P', 'C', 'N', 'M', 'G'])
  articleType?: 'B' | 'P' | 'C' | 'N' | 'M' | 'G';

  @ApiProperty({
    description: '지면사용여부',
    enum: ['Y', 'N'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Y', 'N'])
  exclusiveUse?: 'Y' | 'N';

  @ApiProperty({ description: '면', required: false })
  @IsOptional()
  @IsString()
  printPage?: string;

  @ApiProperty({
    description: '상태',
    enum: ['I', 'C', 'R', 'E'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['I', 'C', 'R', 'E'])
  status?: 'I' | 'C' | 'R' | 'E';

  @ApiProperty({
    description: '조회등급',
    enum: ['A', 'M', 'C'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['A', 'M', 'C'])
  viewRank?: 'A' | 'M' | 'C';

  @ApiProperty({
    description: '외부노출여부',
    enum: ['Y', 'N'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Y', 'N'])
  onOff?: 'Y' | 'N';

  @ApiProperty({ description: '온/ 오프', enum: ['O', 'F'], required: false })
  @IsOptional()
  @IsEnum(['O', 'F'])
  externalExposure?: 'O' | 'F';

  @ApiProperty({ description: '발행일자', required: false })
  @IsOptional()
  @IsString()
  publishDate?: string;

  @ApiProperty({ description: '노출', enum: ['Y', 'N'], required: false })
  @IsOptional()
  @IsEnum(['Y', 'N'])
  isVisible?: 'Y' | 'N';

  @ApiProperty({
    description: '엠바고사용여부',
    enum: ['Y', 'N'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Y', 'N'])
  mbaUsage?: 'Y' | 'N';

  @ApiProperty({ description: '엠바고시간', required: false })
  @IsOptional()
  @IsNumber()
  mbaEndTime?: number;

  @ApiProperty({ description: '키워드', required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({
    description: '이미지 파일들',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  images?: Express.Multer.File[];
}

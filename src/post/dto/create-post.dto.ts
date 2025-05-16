import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: '카테고리',
    enum: ['free', 'question'],
    default: 'free',
  })
  @IsString()
  @IsNotEmpty()
  category: 'free' | 'question';

  @ApiProperty({
    description: '제목',
    default: '제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '게시글 내용',
    default: '오늘은 좋은 하루였어요.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '접근 권한',
    enum: ['public', 'member', 'private'],
    default: 'member',
  })
  @IsString()
  @IsNotEmpty()
  accessLevel: 'public' | 'member' | 'private';

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}

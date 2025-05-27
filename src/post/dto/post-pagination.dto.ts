import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export enum PostCategory {
  ALL = 'all',
  FREE = 'free',
  QUESTION = 'question',
  NOTICE = 'notice',
}

export class PostPaginationDto extends PaginationDto {
  @ApiProperty({
    description: '게시글 카테고리',
    enum: PostCategory,
    default: PostCategory.ALL,
    required: false,
  })
  @IsEnum(PostCategory)
  @IsOptional()
  category?: PostCategory = PostCategory.ALL;
}

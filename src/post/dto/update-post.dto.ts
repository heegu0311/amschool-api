import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: '이미지 업데이트 정보',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', description: '기존 이미지 ID' },
        order: { type: 'number', description: '이미지 순서' },
        isNew: { type: 'boolean', description: '새로운 이미지 여부' },
      },
    },
    required: false,
  })
  @IsOptional()
  @Transform(
    ({
      value,
    }): Array<{
      id?: number;
      order: number;
      isNew: boolean;
    }> => {
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value;
    },
  )
  @IsArray()
  imageUpdates?: Array<{
    id?: number;
    order: number;
    isNew: boolean;
  }>;

  @ApiProperty({
    description: '삭제할 이미지 ID 목록',
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }): number[] => {
    if (value === '' || value == null) return [];
    let parsed: any;
    try {
      parsed = typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
    // 항상 배열로 반환
    if (Array.isArray(parsed)) return parsed;
    return [parsed];
  })
  deletedImageIds?: number[];
}

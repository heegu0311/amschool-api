import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDiaryDto {
  @ApiProperty({ description: '감정 ID', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }): number | undefined =>
    value === '' ? undefined : value,
  )
  emotionId?: number;

  @ApiProperty({ description: '세부 감정 ID', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }): number | undefined =>
    value === '' ? undefined : value,
  )
  subEmotionId?: number;

  @ApiProperty({ description: '오늘의나 내용', required: false, default: '' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: '접근 권한',
    enum: ['public', 'member', 'private'],
    required: false,
  })
  @IsString()
  @IsOptional()
  accessLevel?: 'public' | 'member' | 'private';

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: '업로드할 이미지 파일들 (multipart/form-data)',
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];

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
}

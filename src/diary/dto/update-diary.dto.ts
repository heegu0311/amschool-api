import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDiaryDto {
  @ApiProperty({ description: '감정 ID', required: false })
  @IsOptional()
  emotionId?: number;

  @ApiProperty({ description: '세부 감정 ID', required: false })
  @IsOptional()
  subEmotionId?: number;

  @ApiProperty({ description: '오늘의나 내용', required: false })
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
  accessLevel: 'public' | 'member' | 'private';

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}

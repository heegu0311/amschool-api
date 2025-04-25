import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty({ description: '감정 ID' })
  @IsNotEmpty()
  emotionId: number;

  @ApiProperty({ description: '세부 감정 ID' })
  @IsNotEmpty()
  subEmotionId: number;

  @ApiProperty({ description: '오늘의나 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '접근 권한',
    enum: ['public', 'member', 'private'],
    default: 'public',
  })
  @IsString()
  accessLevel: 'public' | 'member' | 'private';

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  images?: Express.Multer.File[];
}

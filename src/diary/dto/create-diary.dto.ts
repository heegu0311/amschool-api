import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty({ description: '감정 ID' })
  @IsNumber()
  @IsNotEmpty()
  emotionId: number;

  @ApiProperty({ description: '세부 감정 ID', required: false })
  @IsNumber()
  @IsOptional()
  subEmotionId?: number;

  @ApiProperty({ description: '일기 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '썸네일 URL', required: false })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    description: '접근 권한',
    enum: ['public', 'private'],
    default: 'public',
  })
  @IsString()
  @IsOptional()
  accessLevel?: 'public' | 'private';
}

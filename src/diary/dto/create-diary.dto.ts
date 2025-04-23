import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiaryDto {
  @ApiProperty({ description: '감정 ID' })
  @IsNumber()
  @IsNotEmpty()
  emotionId: number;

  @ApiProperty({ description: '세부 감정 ID' })
  @IsNumber()
  @IsNotEmpty()
  subEmotionId: number;

  @ApiProperty({ description: '오늘의나 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '접근 권한',
    enum: ['public', 'private'],
    default: 'public',
  })
  @IsString()
  @IsOptional()
  accessLevel?: 'public' | 'private';
}

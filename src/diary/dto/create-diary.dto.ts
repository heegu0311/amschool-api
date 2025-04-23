import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsNumber()
  emotionId: number;

  @IsNumber()
  @IsOptional()
  subEmotionId?: number;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsEnum(['public', 'private'])
  @IsOptional()
  accessLevel?: 'public' | 'private';
}

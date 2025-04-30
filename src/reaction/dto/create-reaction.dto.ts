import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty({
    description: '공감 이름',
    example: '좋아요',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '공감 이모지',
    example: '👍',
  })
  @IsString()
  @IsNotEmpty()
  emoji: string;
}

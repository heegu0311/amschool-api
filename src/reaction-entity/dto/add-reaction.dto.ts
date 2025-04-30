import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddReactionDto {
  @ApiProperty({
    description: '공감 ID',
    example: 1,
  })
  @IsNumber()
  reactionId: number;
}

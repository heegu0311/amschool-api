import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({
    description: '답글 내용',
    example: '좋은 댓글 감사합니다!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

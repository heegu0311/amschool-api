import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '좋은 글 감사합니다!',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '좋은 글 감사합니다!',
    minLength: 1,
    maxLength: 300,
  })
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  content: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: '수정된 댓글 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

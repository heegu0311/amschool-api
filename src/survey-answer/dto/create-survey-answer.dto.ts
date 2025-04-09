import { ApiProperty } from '@nestjs/swagger';

export class CreateSurveyAnswerDto {
  @ApiProperty({
    description: '설문 답변 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '설문 ID',
    example: 1,
  })
  surveyId: number;

  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '답변 내용',
    example: '예시 답변입니다.',
  })
  answer: string;
}

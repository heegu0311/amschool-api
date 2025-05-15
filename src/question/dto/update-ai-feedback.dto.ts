import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateAiFeedbackDto {
  @ApiProperty({
    description: 'AI 답변에 대한 피드백 점수 (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-5)
  @Max(5)
  feedbackPoint: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateCancerUserDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  user_id: number;

  @ApiProperty({
    description: '암 종류 ID',
    example: 1,
  })
  cancer_id: number;
}

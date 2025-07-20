import { ApiProperty } from '@nestjs/swagger';

export class CreateCancerUserDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: '투병 정보 ID',
    example: 1,
  })
  cancerId: number;
}

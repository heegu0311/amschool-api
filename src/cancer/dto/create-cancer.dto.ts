import { ApiProperty } from '@nestjs/swagger';

export class CreateCancerDto {
  @ApiProperty({
    description: '투병 정보 이름',
    example: '폐암',
  })
  name: string;
}

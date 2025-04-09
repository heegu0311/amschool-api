import { ApiProperty } from '@nestjs/swagger';

export class CreateCancerDto {
  @ApiProperty({
    description: '암 종류 이름',
    example: '폐암',
  })
  name: string;
}

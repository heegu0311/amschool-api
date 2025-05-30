import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: '페이지 번호 (1부터 시작)',
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: '페이지당 항목 수',
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    description: '검색 키워드',
    required: false,
  })
  @IsString()
  @IsOptional()
  keyword?: string;
}

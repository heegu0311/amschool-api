import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}

export const GenderEnum = {
  MALE: Gender.MALE,
  FEMALE: Gender.FEMALE,
} as const;

export type GenderType = (typeof GenderEnum)[keyof typeof GenderEnum];

export class GenderEnumDto {
  @ApiProperty({
    enum: Gender,
    description: '성별',
    example: Gender.MALE,
  })
  gender: Gender;
}

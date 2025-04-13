import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendVerificationEmailDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
    minimum: 6,
  })
  @IsEmail()
  email: string;
}

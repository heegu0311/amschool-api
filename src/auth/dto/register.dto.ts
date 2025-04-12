import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

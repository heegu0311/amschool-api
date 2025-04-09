import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    required: false,
  })
  password?: string;

  @ApiProperty({
    description: '사용자 활성화 상태',
    example: true,
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    description: '로그인 제공자',
    example: 'email',
    required: false,
  })
  signinProvider?: string;
}

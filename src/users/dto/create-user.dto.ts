import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password123',
    required: false,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: '사용자 유형',
    example: 'patient',
    enum: ['patient', 'supporter'],
  })
  @IsEnum(['patient', 'supporter'])
  user_type: 'patient' | 'supporter';

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({
    description: '프로필 타입',
    example: 'default',
    enum: ['default', 'upload'],
  })
  @IsEnum(['default', 'upload'])
  profile_type: 'default' | 'upload';

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  profile_image: string;

  @ApiProperty({
    description: '사용자 소개',
    example: '안녕하세요. 반갑습니다.',
  })
  @IsString()
  intro: string;

  @ApiProperty({
    description: '암 정보 공개 여부',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_public?: boolean;

  @ApiProperty({
    description: '소셜 로그인 제공자',
    example: 'email',
  })
  @IsString()
  signin_provider: string;

  @ApiProperty({
    description: '활성화 여부',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: '관리자 여부',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_admin: boolean;
}

import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
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
    description: '사용자 비밀번호 (최소 6자)',
    example: 'password123',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: '길동이',
  })
  @IsString()
  @MinLength(2)
  nickname: string;

  @ApiProperty({
    description: '사용자 소개',
    example: '안녕하세요. 반갑습니다.',
  })
  @IsString()
  intro: string;

  @ApiProperty({
    description: '사용자 유형',
    example: 'patient',
  })
  @IsString()
  userType: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  profile: string;

  @ApiProperty({
    description: '암 정보 공개 여부',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCancerPublic?: boolean;

  @ApiProperty({
    description: '로그인 제공자',
    example: 'local',
  })
  @IsString()
  signinProvider: string;

  @ApiProperty({
    description: '소셜 로그인 제공자',
    example: 'google',
    required: false,
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({
    description: '소셜 로그인 제공자 ID',
    example: '123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  providerId?: string;

  @ApiProperty({
    description: '계정 활성화 상태',
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
  isAdmin?: boolean;

  @ApiProperty({
    description: '실명',
    example: '홍길동',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SendVerificationEmailDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '인증 코드' })
  @IsString()
  code: string;
}

export class LoginDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @MinLength(8)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: '리프레시 토큰' })
  @IsString()
  refreshToken: string;
}

export class CompleteRegistrationDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: '서비스 이용약관 동의' })
  @IsBoolean()
  agreeService: boolean;

  @ApiProperty({ description: '개인정보 처리방침 동의' })
  @IsBoolean()
  agreePrivacy: boolean;

  @ApiProperty({ description: '마케팅 정보 수신 동의' })
  @IsBoolean()
  agreeMarketing: boolean;

  @ApiProperty({ description: '사용자 유형', enum: ['patient', 'supporter'] })
  @IsString()
  userType: 'patient' | 'supporter';

  @ApiProperty({ description: '암 종류 목록' })
  @IsArray()
  cancerIds: number[];

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ description: '프로필 타입', enum: ['default', 'upload'] })
  @IsString()
  profileType: 'default' | 'upload';

  @ApiProperty({ description: '프로필 이미지 URL' })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ description: '사용자명' })
  @IsString()
  username: string;

  @ApiProperty({ description: '소개글' })
  @IsString()
  @IsOptional()
  intro?: string;

  @ApiProperty({ description: '설문 응답 목록' })
  @IsArray()
  surveyAnswers: number[];

  @ApiProperty({ description: '로그인 제공자' })
  @IsString()
  signinProvider: string;

  @ApiProperty({ description: '관리자 여부' })
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;
}

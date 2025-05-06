import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
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
  @ApiProperty({
    description: '이메일 주소',
    example: 'heegu0311@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '1q2w3e4r!!',
  })
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

  @ApiProperty({ description: '생년월일' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;

  @ApiProperty({ description: '성별' })
  @IsString()
  gender: 'M' | 'F';

  @ApiProperty({ description: '서비스 이용약관 동의' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreeService: boolean;

  @ApiProperty({ description: '개인정보 처리방침 동의' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreePrivacy: boolean;

  @ApiProperty({ description: '마케팅 정보 수신 동의' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreeMarketing: boolean;

  @ApiProperty({ description: '사용자 유형', enum: ['patient', 'supporter'] })
  @IsString()
  userType: 'patient' | 'supporter';

  @ApiProperty({ description: '암 종류 목록' })
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : [],
  )
  cancerIds: number[];

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPublic: boolean;

  @ApiProperty({ description: '프로필 타입', enum: ['default', 'upload'] })
  @IsString()
  profileType: 'default' | 'upload';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '프로필 이미지 URL',
    type: 'string',
    format: 'binary',
    required: false,
  })
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
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : [],
  )
  surveyAnswers: number[];

  @ApiProperty({ description: '로그인 제공자' })
  @IsString()
  signinProvider: string;

  @ApiProperty({ description: '관리자 여부' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAdmin: boolean;

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;
}

export class LogoutDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsNumber()
  userId: number;
}

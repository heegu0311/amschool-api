import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

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
    example: 'example@domain.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '1q1q1q1q',
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: '리프레시 토큰' })
  @IsString()
  refreshToken: string;
}

export class CompleteRegistrationDto {
  @ApiProperty({ description: '이메일 주소', example: 'example@domain.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호', example: '1q1q1q1q' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: '생년월일', example: '1990-01-01' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;

  @ApiProperty({
    description: '성별',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: '서비스 이용약관 동의', example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreeService: boolean;

  @ApiProperty({ description: '개인정보 처리방침 동의', example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreePrivacy: boolean;

  @ApiProperty({ description: '마케팅 정보 수신 동의', example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  agreeMarketing: boolean;

  @ApiProperty({ description: '사용자 유형', enum: ['patient', 'supporter'] })
  @IsString()
  userType: 'patient' | 'supporter';

  @ApiProperty({ description: '암 종류 목록', example: [1] })
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : [],
  )
  cancerIds: number[];

  @ApiProperty({ description: '공개 여부', example: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPublic: boolean;

  @ApiProperty({
    description: '프로필 타입',
    enum: ['default', 'upload'],
    example: 'default',
  })
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

  @IsString()
  @IsOptional()
  images?: string;

  @ApiProperty({ description: '사용자명', example: '암투게더' })
  @IsString()
  username: string;

  @ApiProperty({ description: '소개글', example: '안녕하세요 암투게더입니다.' })
  @IsString()
  @IsOptional()
  intro?: string;

  @ApiProperty({ description: '설문 응답 목록', example: [1] })
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : value ? [Number(value)] : [],
  )
  surveyAnswers: number[];

  @ApiProperty({ description: '로그인 제공자', example: 'email' })
  @IsString()
  signinProvider: string;

  @ApiProperty({ description: '관리자 여부', example: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAdmin: boolean;
}

export class LogoutDto {
  @ApiProperty({ description: '사용자 ID' })
  userId: number;
}

export class NewPasswordDto {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '새 비밀번호' })
  @IsString()
  @MinLength(8)
  password: string;
}

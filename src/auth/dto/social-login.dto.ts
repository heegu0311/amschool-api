import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginDto {
  @ApiProperty({ description: '소셜 로그인 제공자 ID', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: '이메일' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: '소셜 로그인 제공자 (naver, google, kakao)' })
  @IsNotEmpty()
  @IsString()
  provider: string;
}

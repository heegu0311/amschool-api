import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginResponseDto {
  @ApiProperty({ description: 'HTTP 상태 코드' })
  statusCode: number;

  @ApiProperty({ description: '액세스 토큰', required: false })
  accessToken?: string;

  @ApiProperty({ description: '리프레시 토큰', required: false })
  refreshToken?: string;

  @ApiProperty({ description: '회원가입 필요 여부' })
  needRegistration: boolean;

  @ApiProperty({ description: '소셜 로그인 정보', required: false })
  socialInfo?: {
    email: string;
    name: string;
    image?: string;
    provider: string;
    socialId: string;
  };
}

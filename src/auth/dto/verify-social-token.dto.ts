import { IsString, IsEnum } from 'class-validator';

export enum SocialProvider {
  KAKAO = 'kakao',
  NAVER = 'naver',
  GOOGLE = 'google',
}

export class VerifySocialTokenDto {
  @IsEnum(SocialProvider)
  provider: SocialProvider;

  @IsString()
  token: string;
}

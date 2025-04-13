export interface SocialUser {
  email: string;
  name: string;
  provider: 'kakao' | 'naver' | 'google';
  providerId: string;
  username: string;
  password: string;
  signinProvider: 'kakao' | 'naver' | 'google';
  nickname: string;
  intro: string;
  isPublic: boolean;
}

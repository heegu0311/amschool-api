export interface SocialUser {
  email: string;
  name: string;
  provider: 'kakao' | 'naver' | 'google';
  providerId: string;
  username: string;
  password: string;
  signin_provider: 'kakao' | 'naver' | 'google';
  nickname: string;
  intro: string;
  is_cancer_public: boolean;
}

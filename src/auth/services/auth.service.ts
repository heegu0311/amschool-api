import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { EmailService } from 'src/common/services/email.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from '../../common/services/image.service';
import { UsersService } from '../../users/users.service';
import {
  CompleteRegistrationDto,
  LoginDto,
  NewPasswordDto,
} from '../dto/auth.dto';
import { SocialLoginResponseDto } from '../dto/social-login-response.dto';
import { SocialLoginDto } from '../dto/social-login.dto';
import {
  SocialProvider,
  VerifySocialTokenDto,
} from '../dto/verify-social-token.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { EmailVerificationService } from './email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly imageService: ImageService,
  ) {}

  async generateTokens(userId: number, email: string) {
    const payload = { sub: userId, email };

    // Access Token 생성 (15분)
    const accessToken = await this.jwtService.signAsync(payload);

    // Refresh Token 생성 (2주)
    const refreshToken = uuidv4();
    const expiresAt = dayjs().add(14, 'day').toDate();

    const refreshTokens = await this.refreshTokenRepository.find({
      where: { userId },
    });

    if (refreshTokens.length > 0) {
      await Promise.all(
        refreshTokens.map((rt) =>
          this.refreshTokenRepository.delete({
            id: rt.id,
          }),
        ),
      );
    }

    // Refresh Token DB 저장
    await this.refreshTokenRepository.save({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return { userId, accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmailAndProvider(
      loginDto.email,
      'email',
    );
    if (!user) {
      throw new UnauthorizedException('아이디가 존재하지 않습니다.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password || '',
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return { ...user, ...tokens };
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }

    if (dayjs(tokenEntity.expiresAt).isBefore(dayjs())) {
      // 기존 토큰 폐기
      await this.refreshTokenRepository.update(
        { id: tokenEntity.id },
        { isRevoked: true },
      );
      throw new UnauthorizedException('만료된 refresh token입니다.');
    }

    const user = tokenEntity.user;
    const payload = { sub: user.id, email: user.email };
    const newAccessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken: newAccessToken,
    };
  }

  async revokeRefreshToken(userId: number) {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );

    return { message: '로그아웃되었습니다.' };
  }

  async completeRegistration(
    completeRegistrationDto: CompleteRegistrationDto,
    profileImage?: Express.Multer.File,
  ) {
    if (!completeRegistrationDto.password) {
      throw new BadRequestException('비밀번호는 필수입니다.');
    }

    const isVerified = await this.emailVerificationService.isEmailVerified(
      completeRegistrationDto.email,
    );

    if (!isVerified) {
      throw new BadRequestException('이메일 인증이 완료되지 않았습니다.');
    }

    const hashedPassword = await bcrypt.hash(
      completeRegistrationDto.password,
      10,
    );

    let profileImageUrl = '';
    if (profileImage) {
      if (!this.imageService) {
        throw new Error('imageService가 주입되어야 합니다.');
      }
      profileImageUrl = await this.imageService.uploadImage(
        profileImage,
        'user',
      );
    }

    try {
      const user = await this.userService.create({
        ...completeRegistrationDto,
        password: hashedPassword,
        profileImage: profileImageUrl || completeRegistrationDto.profileImage,
      });

      await this.emailService.sendRegistrationCompleteEmail(
        user.email,
        user.username,
      );

      return this.generateTokens(user.id, user.email);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      }

      throw error;
    }
  }

  async resetPassword(newPasswordDto: NewPasswordDto) {
    const { email, password } = newPasswordDto;
    await this.emailVerificationService.getVerifiedOrFail(email);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('존재하지 않는 이메일입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.update(user.id, { password: hashedPassword });
  }

  private async buildSocialLoginResponse(
    socialLoginDto: SocialLoginDto,
    needRegistration: boolean,
    deleted: boolean,
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ): Promise<SocialLoginResponseDto> {
    await this.emailVerificationService.verifyEmail(socialLoginDto.email);
    return {
      statusCode,
      needRegistration,
      deleted,
      socialInfo: {
        email: socialLoginDto.email,
        username: socialLoginDto.username || '',
        image: socialLoginDto.image,
        provider: socialLoginDto.provider,
        socialId: socialLoginDto.id || '',
        birthday: socialLoginDto.birthday || '',
      },
    };
  }

  async socialLogin(
    socialLoginDto: SocialLoginDto,
  ): Promise<SocialLoginResponseDto> {
    try {
      // 이메일로 사용자 찾기
      // const existingUser = await this.userService.findByEmail(
      //   socialLoginDto.email,
      // );

      // 이메일이 존재하지만 provider가 다른 경우
      // if (
      //   existingUser &&
      //   existingUser.signinProvider !== socialLoginDto.provider
      // ) {
      //   throw new BadRequestException(
      //     `${existingUser.signinProvider.toUpperCase()} 계정으로 가입된 이메일입니다.`,
      //   );
      // }

      // 이메일과 provider로 기존 사용자 찾기
      const user = await this.userService.findByEmailAndProvider(
        socialLoginDto.email,
        socialLoginDto.provider,
      );

      // deletedAt이 존재하면 30일 경과 여부 체크
      if (!!user && user.deletedAt) {
        const deletedAt = new Date(user.deletedAt);
        const now = new Date();
        const diffDays =
          (now.getTime() - deletedAt.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays <= 30) {
          return {
            statusCode: HttpStatus.UNAUTHORIZED,
            needRegistration: false,
            deleted: true,
            socialInfo: {
              email: socialLoginDto.email,
              username: socialLoginDto.username || '',
              image: socialLoginDto.image,
              provider: socialLoginDto.provider,
              socialId: socialLoginDto.id || '',
              birthday: socialLoginDto.birthday || '',
            },
          };
        } else {
          return await this.buildSocialLoginResponse(
            socialLoginDto,
            true,
            false,
          );
        }
      }

      // 사용자가 없는 경우 회원가입 필요
      if (!user) {
        return await this.buildSocialLoginResponse(socialLoginDto, true, false);
      }

      // 토큰 생성
      const tokens = await this.generateTokens(user.id, user.email);
      return {
        ...tokens,
        statusCode: HttpStatus.OK,
        needRegistration: false,
        deleted: false,
        socialInfo: {
          email: user.email,
          username: user.username || '',
          image: user.profileImage,
          provider: user.signinProvider,
          socialId: user.id || '',
          birthday: socialLoginDto.birthday || '',
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('이미 가입된 이메일입니다.');
      }
      throw error;
    }
  }

  async verifySocialToken(dto: VerifySocialTokenDto) {
    const { provider, token } = dto;

    // 소셜 제공자별 토큰 검증
    let socialUserInfo;
    switch (provider) {
      case SocialProvider.KAKAO:
        socialUserInfo = await this.verifyKakaoToken(token);
        break;
      case SocialProvider.NAVER:
        socialUserInfo = await this.verifyNaverToken(token);
        break;
      case SocialProvider.GOOGLE:
        socialUserInfo = await this.verifyGoogleToken(token);
        break;
      default:
        throw new UnauthorizedException(
          '지원하지 않는 소셜 로그인 제공자입니다.',
        );
    }

    // socialLogin 메서드를 통해 사용자 처리
    const socialLoginDto: SocialLoginDto = {
      email: socialUserInfo.email,
      username: socialUserInfo.name,
      image: socialUserInfo.image,
      provider: socialUserInfo.provider,
      id: socialUserInfo.id,
      birthday: socialUserInfo.birthday,
    };

    return this.socialLogin(socialLoginDto);
  }

  private async verifyKakaoToken(token: string) {
    try {
      const response = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('유효하지 않은 카카오 토큰입니다.');
      }

      const data = await response.json();
      const birthday =
        data.kakao_account?.birthyear + data.kakao_account?.birthday;

      return {
        id: data.id,
        email: data.kakao_account?.email,
        name: data.properties?.nickname,
        image: data.properties?.profile_image,
        birthday: birthday
          ? `${birthday.slice(0, 4)}-${birthday.slice(4, 6)}-${birthday.slice(6, 8)}`
          : null,
        provider: 'kakao',
      };
    } catch {
      throw new UnauthorizedException('카카오 토큰 검증에 실패했습니다.');
    }
  }

  private async verifyNaverToken(token: string) {
    try {
      const response = await fetch('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('유효하지 않은 네이버 토큰입니다.');
      }

      const data = await response.json();
      return {
        id: data.response.id,
        email: data.response.email,
        name: data.response.nickname,
        image: data.response.profile_image,
        birthday: data.response.birthyear
          ? `${data.response.birthyear}-${data.response.birthday}`
          : null,
        provider: 'naver',
      };
    } catch {
      throw new UnauthorizedException('네이버 토큰 검증에 실패했습니다.');
    }
  }

  private async verifyGoogleToken(token: string) {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new UnauthorizedException('유효하지 않은 구글 토큰입니다.');
      }

      const data = await response.json();
      return {
        id: data.sub,
        email: data.email,
        name: data.name,
        image: data.picture,
        provider: 'google',
      };
    } catch {
      throw new UnauthorizedException('구글 토큰 검증에 실패했습니다.');
    }
  }
}

import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../../auth/services/auth.service';
import { Public } from '../decorators/public.decorator';
import {
  CompleteRegistrationDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  SendVerificationEmailDto,
  VerifyEmailDto,
} from '../dto/auth.dto';
import { EmailVerificationService } from '../services/email-verification.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Post('send-verification-email')
  async sendVerificationEmail(
    @Body() sendVerificationEmailDto: SendVerificationEmailDto,
  ): Promise<{ message: string }> {
    // 이메일 인증 코드 생성 및 발송
    await this.emailVerificationService.sendVerificationEmail(
      sendVerificationEmailDto.email,
    );
    return { message: '인증 이메일이 발송되었습니다.' };
  }

  @Public()
  @HttpCode(200)
  @Post('verify-code')
  async verifyCode(
    @Body() verifyCodeDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    await this.emailVerificationService.verifyCode(
      verifyCodeDto.email,
      verifyCodeDto.code,
    );

    return { message: '이메일이 인증되었습니다.' };
  }

  @Public()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const result = await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );

    // 액세스 토큰을 쿠키로 설정
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15분 (밀리초 단위)
    });

    return result;
  }

  @Public()
  @Post('logout')
  async logout(
    @Body() logoutDto: LogoutDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.authService.revokeRefreshToken(logoutDto.userId);

    // 쿠키 삭제
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: '로그아웃되었습니다.' };
  }

  @Public()
  @Post('complete-registration')
  async completeRegistration(
    @Body() completeRegistrationDto: CompleteRegistrationDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.completeRegistration(completeRegistrationDto);
  }
}

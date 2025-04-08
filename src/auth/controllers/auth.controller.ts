import { Body, Controller, Post, Request, HttpCode } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { EmailVerificationService } from '../services/email-verification.service';
import { CompleteRegistrationDto } from '../dto/complete-registration.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { Public } from '../decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    // 이메일 인증 코드 생성 및 발송
    await this.emailVerificationService.sendVerificationEmail(
      registerDto.email,
    );
    return { message: '인증 이메일이 발송되었습니다.' };
  }

  @Public()
  @HttpCode(200)
  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    await this.emailVerificationService.verifyEmail(
      verifyEmailDto.email,
      verifyEmailDto.code,
    );

    return { message: '이메일이 인증되었습니다.' };
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @ApiBearerAuth('access-token')
  @Post('logout')
  async logout(@Request() req): Promise<{ message: string }> {
    await this.authService.revokeRefreshToken(req.user.id);
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

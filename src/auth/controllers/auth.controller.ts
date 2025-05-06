import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  ConflictException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
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
import { UsersService } from '../../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('send-verification-email')
  @ApiOperation({ summary: '이메일 인증 코드 발송' })
  @ApiBody({ type: SendVerificationEmailDto })
  @ApiResponse({
    status: 200,
    description: '인증 이메일 발송 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '인증 이메일이 발송되었습니다.' },
      },
    },
  })
  async sendVerificationEmail(
    @Body() sendVerificationEmailDto: SendVerificationEmailDto,
  ): Promise<{ message: string }> {
    // 이미 가입된 유저인지 확인
    const exists = await this.usersService.existsByEmail(
      sendVerificationEmailDto.email,
    );
    if (exists) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
    // 이메일 인증 코드 생성 및 발송
    await this.emailVerificationService.sendVerificationEmail(
      sendVerificationEmailDto.email,
    );
    return { message: '인증 이메일이 발송되었습니다.' };
  }

  @Public()
  @HttpCode(200)
  @Post('verify-code')
  @ApiOperation({ summary: '이메일 인증 코드 검증' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: 200,
    description: '이메일 인증 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '이메일이 인증되었습니다.' },
      },
    },
  })
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
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(loginDto);
  }

  @Public()
  @HttpCode(200)
  @Post('refresh')
  @ApiOperation({ summary: '액세스 토큰 갱신' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: '토큰 갱신 성공',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
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
  @ApiOperation({ summary: '로그아웃' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '로그아웃되었습니다.' },
      },
    },
  })
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
  @UseInterceptors(
    FileInterceptor('profileImage', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '회원가입 완료' })
  @ApiBody({ type: CompleteRegistrationDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 완료',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
      },
    },
  })
  async completeRegistration(
    @Body() completeRegistrationDto: CompleteRegistrationDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.completeRegistration(
      completeRegistrationDto,
      profileImage,
    );
  }
}

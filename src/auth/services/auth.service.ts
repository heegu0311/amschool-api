import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginDto,
  CompleteRegistrationDto,
  NewPasswordDto,
} from '../dto/auth.dto';
import { EmailVerificationService } from './email-verification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { UsersService } from 'src/users/users.service';
import { CancerUserService } from 'src/cancer-user/cancer-user.service';
import { ImageService } from 'src/common/services/image.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly cancerUserService: CancerUserService,
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

    // Refresh Token DB 저장
    await this.refreshTokenRepository.save({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
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
      // diary.service.ts 참고: imageService.uploadImage 사용
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

      // 선택된 암 정보가 있는 경우 cancer_user 테이블에 추가
      if (
        completeRegistrationDto.cancerIds &&
        completeRegistrationDto.cancerIds.length > 0
      ) {
        await Promise.all(
          completeRegistrationDto.cancerIds.map(async (cancerId) => {
            await this.cancerUserService.create({
              userId: user.id,
              cancerId,
            });
          }),
        );
      }

      return this.generateTokens(user.id, user.email);
    } catch (error) {
      // MySQL 중복 키 에러 코드
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('이미 존재하는 이메일입니다.');
      }

      throw error; // 다른 에러는 전역 예외 필터가 처리
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
}

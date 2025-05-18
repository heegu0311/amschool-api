import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ImageService } from '../../common/services/image.service';
import { UsersService } from '../../users/users.service';
import {
  CompleteRegistrationDto,
  LoginDto,
  NewPasswordDto,
} from '../dto/auth.dto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { EmailVerificationService } from './email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
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
}

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dto/login.dto';
import { CompleteRegistrationDto } from '../dto/complete-registration.dto';
import { EmailVerificationService } from './email-verification.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailVerificationService: EmailVerificationService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
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
    const user = await this.usersService.findByEmail(loginDto.email);
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

    return this.generateTokens(user.id, user.email);
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
      throw new UnauthorizedException('만료된 refresh token입니다.');
    }

    // 새로운 Access Token 발급
    const payload = { sub: tokenEntity.user.id, email: tokenEntity.user.email };
    const newAccessToken = await this.jwtService.signAsync(payload);

    // Refresh Token Rotation
    const newRefreshToken = uuidv4();
    const newExpiresAt = dayjs().add(14, 'day').toDate();

    // 기존 토큰 폐기
    await this.refreshTokenRepository.update(
      { id: tokenEntity.id },
      { isRevoked: true },
    );

    // 새로운 Refresh Token 저장
    await this.refreshTokenRepository.save({
      userId: tokenEntity.user.id,
      token: newRefreshToken,
      expiresAt: newExpiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async revokeRefreshToken(userId: number) {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async completeRegistration(completeRegistrationDto: CompleteRegistrationDto) {
    const isVerified = await this.emailVerificationService.isEmailVerified(
      completeRegistrationDto.email,
    );

    if (!isVerified) {
      throw new BadRequestException('이메일 인증이 완료되지 않았습니다.');
    }

    if (!completeRegistrationDto.password) {
      throw new BadRequestException('비밀번호는 필수입니다.');
    }

    const hashedPassword = await bcrypt.hash(
      completeRegistrationDto.password,
      10,
    );

    const user = await this.usersService.create({
      ...completeRegistrationDto,
      password: hashedPassword,
      username: completeRegistrationDto.email.split('@')[0],
      isActive: true,
      signinProvider: 'email',
    });

    if (!user) {
      throw new BadRequestException('사용자 생성에 실패했습니다.');
    }

    return this.generateTokens(user.id, user.email);
  }
}

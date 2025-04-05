import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailService } from '../../common/services/email.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
    private emailService: EmailService,
  ) {}

  async sendVerificationEmail(email: string): Promise<void> {
    try {
      // 이전 인증 코드가 있다면 삭제
      await this.emailVerificationRepository.delete({ email });

      // 새로운 인증 코드 생성
      const verificationCode = crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase();

      // 인증 정보 저장
      const emailVerification = this.emailVerificationRepository.create({
        email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10분 후 만료
      });
      await this.emailVerificationRepository.save(emailVerification);

      // 이메일 발송
      await this.emailService.sendVerificationEmail(email, verificationCode);
    } catch (error) {
      console.error('이메일 인증 메일 발송 실패:', error);
      throw new BadRequestException('이메일 인증 메일 발송에 실패했습니다.');
    }
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });

    if (!verification) {
      throw new BadRequestException('인증 코드를 찾을 수 없습니다.');
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('인증 코드가 만료되었습니다.');
    }

    if (verification.code !== code) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }
  }

  async isEmailVerified(email: string): Promise<boolean> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email, isVerified: true },
      order: { createdAt: 'DESC' },
    });
    return !!verification;
  }
}

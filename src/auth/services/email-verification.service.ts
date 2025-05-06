import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from '../entities/email-verification.entity';
import { EmailService } from '../../common/services/email.service';
import dayjs from 'dayjs';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
    private emailService: EmailService,
  ) {}

  async sendVerificationEmail(email: string): Promise<void> {
    // 이전 인증 코드가 있다면 삭제
    await this.emailVerificationRepository.delete({ email });

    // 4자리 숫자 인증 코드 생성 (0000~9999)
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 인증 정보 저장
    const emailVerification = this.emailVerificationRepository.create({
      email,
      code: verificationCode,
      expiresAt: dayjs().add(10, 'minute').toDate(), // 10분 후 만료
    });
    await this.emailVerificationRepository.save(emailVerification);

    // 이메일 발송
    await this.emailService.sendVerificationEmail(email, verificationCode);
  }

  async verifyCode(email: string, code: string): Promise<void> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });

    if (!verification) {
      throw new BadRequestException('인증 코드를 찾을 수 없습니다.');
    }

    if (dayjs(verification.expiresAt).isBefore(dayjs())) {
      throw new BadRequestException('인증 코드가 만료되었습니다.');
    }

    if (verification.code !== code) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }

    await this.emailVerificationRepository.update(verification.id, {
      isVerified: true,
    });
  }

  async isEmailVerified(email: string): Promise<boolean> {
    const verification = await this.emailVerificationRepository.findOne({
      where: { email, isVerified: true },
      order: { createdAt: 'DESC' },
    });
    return !!verification;
  }
}

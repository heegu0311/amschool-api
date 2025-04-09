import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    }) as Transporter;
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM'),
        to: options.to,
        subject: options.subject,
        text: options.text,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('이메일 발송 실패:', error);
      throw error;
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    try {
      await this.sendEmail({
        to: email,
        subject: '이메일 인증',
        text: `인증 코드: ${verificationCode}\n이 코드는 10분 동안 유효합니다.`,
      });
    } catch (error) {
      console.error('이메일 인증 메일 발송 실패:', error);
      throw error;
    }
  }
}

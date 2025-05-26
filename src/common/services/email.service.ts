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
      tls: {
        rejectUnauthorized: false,
      },
    }) as Transporter;
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<void> {
    try {
      const mailOptions = {
        from: {
          name: 'AMSCHOOL',
          address: this.configService.get<string>('SMTP_FROM'),
        },
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          Importance: 'high',
        },
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
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">이메일 인증</h2>
          <p>안녕하세요,</p>
          <p>아래의 인증 코드를 입력해주세요:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>이 코드는 10분 동안 유효합니다.</p>
          <p>감사합니다.</p>
        </div>
      `;

      await this.sendEmail({
        to: email,
        subject: '암투게더 이메일 인증',
        text: `인증 코드: ${verificationCode}\n이 코드는 10분 동안 유효합니다.`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('이메일 인증 메일 발송 실패:', error);
      throw error;
    }
  }
}

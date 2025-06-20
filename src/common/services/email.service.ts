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
          name: '암투게더',
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
    purpose?: string,
  ): Promise<void> {
    try {
      const htmlContent = `
        <body>
          <img src="${process.env.AWS_S3_BUCKET}/logo/logo_kr.png" alt="암투게더 로고" style="height: 40px; padding: 40px 20px" >
          <div style="width: 100%; border-collapse: collapse;">
            <div>
              <div style="padding: 0 20px;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="color: #292524; font-size: 20px; font-family: 'Noto Sans KR', sans-serif; font-weight: 700; line-height: 28px; word-wrap: break-word; padding-bottom: 16px;">${purpose === 'reset-password' ? '비밀번호 변경을 위한 인증 코드를 발송드립니다.' : '안녕하세요, 암투게더에 오신 것을 환영합니다.'}</div>
                  </div>
                  <div>
                    <div style="width: 558px; color: #292524; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 400; line-height: 28px; word-wrap: break-word;">아래 인증 코드를 입력하시면 회원가입을 계속 진행하실 수 있습니다.</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 20px;">
                <div style="width: auto; max-width: 171px; padding: 16px 32px; background: #FFF4F2; border-radius: 8px;">
                  <div>
                    <div style="text-align: center; color: #FF7A6D; font-size: 30px; font-family: 'Noto Sans KR', sans-serif; font-weight: 700; line-height: 36px; word-wrap: break-word;">${verificationCode}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 0 20px;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="color: #57534E; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 400; line-height: 28px; word-wrap: break-word;">
                      해당 코드는 <span style="color: #57534E; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; line-height: 24px; word-wrap: break-word;">10분</span>간 유효하며, 인증번호란에 입력하시면<br/>${purpose === 'reset-password' ? '새로운 비밀번호로 변경하실 수 있습니다.' : '다음 단계로 이동해 프로필을 완성하실 수 있습니다.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 20px 0;">
                <div style="width: 100%; height: 1px; background-color: #E7E5E4;"></div>
              </div>
            </div>
            <div>
              <div style="padding: 20px;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="color: #57534E; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 700; line-height: 24px; word-wrap: break-word;">암투게더<span style="color: #57534E; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 400; line-height: 28px; word-wrap: break-word;">는 암환우분들이 서로 연결되고, 함께 감정을 공유하는 공간입니다.<br/>가입해 주셔서 진심으로 감사드립니다.</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 24px 0; background: #FAFAF9;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="padding: 0 24px;">
                      <div style="width: 100%; border-collapse: collapse;">
                        <div>
                          <div style="width: 552px; color: #78716C; font-size: 12px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; line-height: 20px; word-wrap: break-word;">
                            상호 : 시에라헬스케어암스쿨<br/>주소 : 서울특별시 마포구 큰우물로 51 502<br/>이메일 : amsch365@gmail.com<br/>청소년보호책임자 : 김요한<br/>시에라헬스케어암스쿨(영상, 기사 사진)는 저작권법의 보호를 <br/>받는 바, 부단 전제와 복사, 배포등을 금합니다.
                          </div>
                        </div>
                        <div>
                          <div style="width: 552px; color: #A8A29E; font-size: 12px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; line-height: 20px; word-wrap: break-word; padding-top: 16px;">
                            Copyright © 2025 시에라헬스케어암스쿨. All rights reserved. mail to amsch365@gmail.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      `;

      await this.sendEmail({
        to: email,
        subject:
          purpose === 'reset-password'
            ? `[암투게더] 비밀번호 변경을 도와드릴게요, 인증번호를 확인해주세요! - [${verificationCode}]`
            : `[암투게더] 가입을 도와드릴게요, 인증번호를 확인해주세요! - [${verificationCode}]`,
        text: `인증 코드: ${verificationCode}\n이 코드는 10분 동안 유효합니다.`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('이메일 인증 메일 발송 실패:', error);
      throw error;
    }
  }

  async sendRegistrationCompleteEmail(
    email: string,
    name: string,
  ): Promise<void> {
    try {
      const htmlContent = `
        <body>
          <img src="https://im-together-bucket-dev.s3.ap-northeast-2.amazonaws.com/logo/logo_kr.png" alt="암투게더 로고" style="height: 40px; padding: 40px 20px" >
          <div style="width: 100%; border-collapse: collapse;">
            <div>
              <div style="padding: 0 20px;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="color: #292524; font-size: 20px; font-family: 'Noto Sans KR', sans-serif; font-weight: 700; line-height: 28px; word-wrap: break-word; padding-bottom: 16px;"><span style="color: #FF7A6D;">${name}</span>님 안녕하세요.<br/>암투게더에 가입해 주셔서 감사합니다!</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 0 20px 20px 20px;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="color: #57534E; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 400; line-height: 28px; word-wrap: break-word;">
                      지금부터 ${name}님의 일기장이 열렸습니다.<br/>오늘의 감정을 기록해보거나, 나와 비슷한 환우들의 글을 읽어보거나 함께 소통해보세요.<br/>당신의 이야기가 이곳에 큰 위로와 힘이 될 거에요.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 0 20px; text-align: center; display: inline-flex; justify-content: start;">
                <a href="https://im-together.com" style="padding: 12px 24px; background-color: #fff4f2; border: 1px solid #f87171; color: #1c1917; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; text-decoration: none; border-radius: 8px;">암투게더 시작하기</a>
              </div>
            </div>
            <div>
              <div style="padding: 20px;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="color: #57534E; font-size: 16px; font-family: 'Noto Sans KR', sans-serif; font-weight: 400; line-height: 28px; word-wrap: break-word;">
                      우리는 함께할 때 더 강해질 수 있습니다.<br/>언제든지, 암투게더는 곁에 있을게요.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div style="padding: 24px 0; background: #FAFAF9;">
                <div style="width: 100%; border-collapse: collapse;">
                  <div>
                    <div style="padding: 0 24px;">
                      <div style="width: 100%; border-collapse: collapse;">
                        <div>
                          <div style="width: 552px; color: #78716C; font-size: 12px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; line-height: 20px; word-wrap: break-word;">
                            상호 : 시에라헬스케어암스쿨<br/>주소 : 서울특별시 마포구 큰우물로 51 502<br/>이메일 : amsch365@gmail.com<br/>청소년보호책임자 : 김요한<br/>시에라헬스케어암스쿨(영상, 기사 사진)는 저작권법의 보호를 <br/>받는 바, 부단 전제와 복사, 배포등을 금합니다.
                          </div>
                        </div>
                        <div>
                          <div style="width: 552px; color: #A8A29E; font-size: 12px; font-family: 'Noto Sans KR', sans-serif; font-weight: 500; line-height: 20px; word-wrap: break-word; padding-top: 16px;">
                            Copyright © 2025 시에라헬스케어암스쿨. All rights reserved. mail to amsch365@gmail.com
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      `;

      await this.sendEmail({
        to: email,
        subject: `${name}님, 암투게더 가입을 축하드립니다!`,
        text: `${name}님 안녕하세요!\n\n암투게더 가입을 축하드립니다!\n지금부터 ${name}님의 일기장이 열렸습니다. 오늘의 감정을 기록해보거나, 나와 비슷한 환우들의 글을 읽어보거나 함께 소통해보세요.\n당신의 이야기가 이곳에 큰 위로와 힘이 될 거에요.\n\n암투게더 시작하기: [Link to Amstool]\n\n우리는 함께할 때 더 강해질 수 있습니다.\n언제든지, 암투게더는 곁에 있을게요.\n\n감사합니다.\n\n[회사 정보]\n상호 : 시에라헬스케어암스쿨\n주소 : 서울특별시 마포구 큰우물로 51 502\n이메일 : amsch365@gmail.com\n청소년보호책임자 : 김요한\n\nCopyright © 2025 시에라헬스케어암스쿨. All rights reserved. mail to amsch365@gmail.com`,
        html: htmlContent,
      });
    } catch (error) {
      console.error('회원가입 완료 메일 발송 실패:', error);
      throw error;
    }
  }
}

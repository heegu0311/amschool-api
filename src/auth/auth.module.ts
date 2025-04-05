import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { SocialAuthController } from './controllers/social-auth.controller';
import { AuthService } from './services/auth.service';
import { SocialAuthService } from './services/social-auth.service';
import { EmailVerificationService } from './services/email-verification.service';
import { UsersModule } from '../users/users.module';
import { EmailVerification } from './entities/email-verification.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { EmailService } from 'src/common/services/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    UsersModule,
    TypeOrmModule.forFeature([EmailVerification, RefreshToken]),
  ],
  controllers: [AuthController, SocialAuthController],
  providers: [
    AuthService,
    SocialAuthService,
    EmailVerificationService,
    EmailService,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

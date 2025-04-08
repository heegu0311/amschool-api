import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/common/services/email.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { SocialAuthController } from './controllers/social-auth.controller';
import { EmailVerification } from './entities/email-verification.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
import { EmailVerificationService } from './services/email-verification.service';
import { SocialAuthService } from './services/social-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
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

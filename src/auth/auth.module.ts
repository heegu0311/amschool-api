import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUserModule } from '../cancer-user/cancer-user.module';
import { Image } from '../common/entities/image.entity';
import { EmailService } from '../common/services/email.service';
import { ImageService } from '../common/services/image.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controllers/auth.controller';
import { SocialAuthController } from './controllers/social-auth.controller';
import { EmailVerification } from './entities/email-verification.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
import { EmailVerificationService } from './services/email-verification.service';
import { SocialAuthService } from './services/social-auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [
    UsersModule,
    CancerUserModule,
    TypeOrmModule.forFeature([EmailVerification, RefreshToken, Image]),
  ],
  controllers: [AuthController, SocialAuthController],
  providers: [
    AuthService,
    SocialAuthService,
    EmailVerificationService,
    EmailService,
    ImageService,
    S3Service,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

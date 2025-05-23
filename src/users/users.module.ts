import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUserModule } from 'src/cancer-user/cancer-user.module';
import { CancerUserService } from 'src/cancer-user/cancer-user.service';
import { SurveyAnswerUser } from 'src/survey-answer-user/entities/survey-answer-user.entity';
import { SurveyAnswerUserModule } from 'src/survey-answer-user/survey-answer-user.module';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';
import { Image } from '../common/entities/image.entity';
import { ImageService } from '../common/services/image.service';
import { S3Service } from '../common/services/s3.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CancerUser, SurveyAnswerUser, Image]),
    CancerUserModule,
    SurveyAnswerUserModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, CancerUserService, ImageService, S3Service],
  exports: [UsersService],
})
export class UsersModule {}

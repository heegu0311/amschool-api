import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyAnswerUserModule } from 'src/survey-answer-user/survey-answer-user.module';
import { CancerUserModule } from '../cancer-user/cancer-user.module';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';
import { Image } from '../common/entities/image.entity';
import { ImageService } from '../common/services/image.service';
import { S3Service } from '../common/services/s3.service';
import { ReactionEntityModule } from '../reaction-entity/reaction-entity.module';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, User, Image, CancerUser]),
    ReactionEntityModule,
    CancerUserModule,
    SurveyAnswerUserModule,
  ],
  controllers: [PostController],
  providers: [PostService, UsersService, ImageService, S3Service],
})
export class PostModule {}

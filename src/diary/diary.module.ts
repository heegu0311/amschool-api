import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';
import { Image } from '../common/entities/image.entity';
import { ImageService } from '../common/services/image.service';
import { S3Service } from '../common/services/s3.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ReactionEntityModule } from '../reaction-entity/reaction-entity.module';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { EmotionModule } from './emotion/emotion.module';
import { Diary } from './entities/diary.entity';
import { Emotion } from './entities/emotion.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, Emotion, User, CancerUser, Image]),
    EmotionModule,
    ReactionEntityModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, UsersService, ImageService, S3Service],
})
export class DiaryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUserModule } from 'src/cancer-user/cancer-user.module';
import { CancerUser } from 'src/cancer-user/entities/cancer-user.entity';
import { UsersModule } from 'src/users/users.module';
import { Image } from '../common/entities/image.entity';
import { ImageService } from '../common/services/image.service';
import { S3Service } from '../common/services/s3.service';
import { ReactionEntityModule } from '../reaction-entity/reaction-entity.module';
import { User } from '../users/entities/user.entity';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { EmotionModule } from './emotion/emotion.module';
import { Diary } from './entities/diary.entity';
import { Emotion } from './entities/emotion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, Emotion, User, Image, CancerUser]),
    EmotionModule,
    ReactionEntityModule,
    CancerUserModule,
    UsersModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, ImageService, S3Service],
})
export class DiaryModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUser } from 'src/cancer-user/entities/cancer-user.entity';
import { Image } from 'src/common/entities/image.entity';
import { ImageService } from 'src/common/services/image.service';
import { S3Service } from 'src/common/services/s3.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
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

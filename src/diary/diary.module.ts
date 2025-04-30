import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from './entities/diary.entity';
import { Emotion } from './entities/emotion.entity';
import { EmotionModule } from './emotion/emotion.module';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CancerUser } from 'src/cancer-user/entities/cancer-user.entity';
import { Image } from 'src/common/entities/image.entity';
import { ImageService } from 'src/common/services/image.service';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, Emotion, User, CancerUser, Image]),
    EmotionModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, UsersService, ImageService, S3Service],
})
export class DiaryModule {}

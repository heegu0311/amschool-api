import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from './entities/diary.entity';
import { Emotion } from './entities/emotion.entity';
import { EmotionModule } from './emotion/emotion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, Emotion]), EmotionModule],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}

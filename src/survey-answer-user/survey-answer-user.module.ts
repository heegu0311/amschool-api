import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyAnswerUser } from './entities/survey-answer-user.entity';
import { SurveyAnswerUserService } from './survey-answer-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyAnswerUser])],
  providers: [SurveyAnswerUserService],
  exports: [SurveyAnswerUserService],
})
export class SurveyAnswerUserModule {}

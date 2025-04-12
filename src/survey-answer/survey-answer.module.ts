import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyAnswer } from './entities/survey-answer.entity';
import { SurveyAnswerController } from './survey-answer.controller';
import { SurveyAnswerService } from './survey-answer.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyAnswer])],
  controllers: [SurveyAnswerController],
  providers: [SurveyAnswerService],
})
export class SurveyAnswerModule {}

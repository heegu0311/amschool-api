import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyAnswer } from './entities/survey-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyAnswer])],
})
export class SurveyAnswerModule {}

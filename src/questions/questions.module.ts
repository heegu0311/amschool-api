import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnswer } from './entities/ai-answer.entity';
import { Question } from './entities/question.entity';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { CommonModule } from 'src/common/common.module';
import { Image } from '../common/entities/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, AiAnswer, Image]),
    CommonModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}

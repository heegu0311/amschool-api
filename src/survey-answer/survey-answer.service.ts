import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyAnswer } from './entities/survey-answer.entity';

@Injectable()
export class SurveyAnswerService {
  constructor(
    @InjectRepository(SurveyAnswer)
    private surveyAnswerRepository: Repository<SurveyAnswer>,
  ) {}

  findAll(): Promise<SurveyAnswer[]> {
    return this.surveyAnswerRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} surveyAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} surveyAnswer`;
  }
}

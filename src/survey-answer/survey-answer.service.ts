import { Injectable } from '@nestjs/common';

@Injectable()
export class SurveyAnswerService {
  findAll() {
    return `This action returns all surveyAnswer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} surveyAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} surveyAnswer`;
  }
}

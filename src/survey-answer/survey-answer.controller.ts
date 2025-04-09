import { Controller, Get, Param } from '@nestjs/common';
import { SurveyAnswerService } from './survey-answer.service';

@Controller('survey-answer')
export class SurveyAnswerController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}

  @Get()
  findAll() {
    return this.surveyAnswerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyAnswerService.findOne(+id);
  }
}

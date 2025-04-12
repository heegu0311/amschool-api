import { Controller, Get } from '@nestjs/common';
import { SurveyAnswerService } from './survey-answer.service';
import { Public } from '../auth/decorators/public.decorator';
@Controller('survey-answers')
export class SurveyAnswerController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}

  @Get()
  @Public()
  findAll() {
    return this.surveyAnswerService.findAll();
  }
}

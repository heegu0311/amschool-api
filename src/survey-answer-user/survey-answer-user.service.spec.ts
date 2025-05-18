import { Test, TestingModule } from '@nestjs/testing';
import { SurveyAnswerUserService } from './survey-answer-user.service';

describe('SurveyAnswerUserService', () => {
  let service: SurveyAnswerUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyAnswerUserService],
    }).compile();

    service = module.get<SurveyAnswerUserService>(SurveyAnswerUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

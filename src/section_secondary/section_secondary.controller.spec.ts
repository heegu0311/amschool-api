import { Test, TestingModule } from '@nestjs/testing';
import { SectionSecondaryController } from './section_secondary.controller';
import { SectionSecondaryService } from './section_secondary.service';

describe('SectionSecondaryController', () => {
  let controller: SectionSecondaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionSecondaryController],
      providers: [SectionSecondaryService],
    }).compile();

    controller = module.get<SectionSecondaryController>(SectionSecondaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

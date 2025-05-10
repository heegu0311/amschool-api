import { Test, TestingModule } from '@nestjs/testing';
import { SectionSecondaryService } from './section_secondary.service';

describe('SectionSecondaryService', () => {
  let service: SectionSecondaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionSecondaryService],
    }).compile();

    service = module.get<SectionSecondaryService>(SectionSecondaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

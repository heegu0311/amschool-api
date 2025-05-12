import { Test, TestingModule } from '@nestjs/testing';
import { SectionPrimaryService } from './section_primary.service';

describe('SectionPrimaryService', () => {
  let service: SectionPrimaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SectionPrimaryService],
    }).compile();

    service = module.get<SectionPrimaryService>(SectionPrimaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SectionPrimaryController } from './section_primary.controller';
import { SectionPrimaryService } from './section_primary.service';

describe('SectionPrimaryController', () => {
  let controller: SectionPrimaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionPrimaryController],
      providers: [SectionPrimaryService],
    }).compile();

    controller = module.get<SectionPrimaryController>(SectionPrimaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

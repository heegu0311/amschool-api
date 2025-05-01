import { Test, TestingModule } from '@nestjs/testing';
import { ReactionEntityService } from './reaction-entity.service';

describe('ReactionEntityService', () => {
  let service: ReactionEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactionEntityService],
    }).compile();

    service = module.get<ReactionEntityService>(ReactionEntityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

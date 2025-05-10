import { Test, TestingModule } from '@nestjs/testing';
import { ArticleImageService } from './article-image.service';

describe('ArticleImageService', () => {
  let service: ArticleImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleImageService],
    }).compile();

    service = module.get<ArticleImageService>(ArticleImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

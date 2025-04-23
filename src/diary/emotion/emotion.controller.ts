import { Controller, Get, Param } from '@nestjs/common';
import { EmotionService } from './emotion.service';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Get()
  findAll() {
    return this.emotionService.findAll();
  }

  @Get('parents')
  findParentEmotions() {
    return this.emotionService.findParentEmotions();
  }

  @Get(':parentId/children')
  findChildEmotions(@Param('parentId') parentId: string) {
    return this.emotionService.findChildEmotions(+parentId);
  }
}

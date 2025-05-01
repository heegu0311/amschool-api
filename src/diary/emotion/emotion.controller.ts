import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Emotion } from '../entities/emotion.entity';
import { EmotionService } from './emotion.service';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Get()
  @ApiOperation({ summary: '모든 감정 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '감정 목록 조회 성공',
    type: [Emotion],
  })
  findAll() {
    return this.emotionService.findAll();
  }

  @Get('parents')
  @ApiOperation({ summary: '부모 감정 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '부모 감정 목록 조회 성공',
    type: [Emotion],
  })
  findParentEmotions() {
    return this.emotionService.findParentEmotions();
  }

  @Get(':parentId/children')
  @ApiOperation({ summary: '특정 부모 감정의 자식 감정 목록 조회' })
  @ApiParam({
    name: 'parentId',
    required: true,
    type: Number,
    description: '부모 감정 ID',
  })
  @ApiResponse({
    status: 200,
    description: '자식 감정 목록 조회 성공',
    type: [Emotion],
  })
  @ApiResponse({
    status: 404,
    description: '부모 감정을 찾을 수 없음',
  })
  findChildEmotions(@Param('parentId') parentId: string) {
    return this.emotionService.findChildEmotions(+parentId);
  }
}

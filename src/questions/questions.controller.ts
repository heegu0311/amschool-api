import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    return await this.questionsService.create(createQuestionDto, req.user.id);
  }

  @Get()
  async findAll() {
    return await this.questionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.questionsService.findOne(+id);
  }

  @Post(':id/ai-answer')
  @UseGuards(JwtAuthGuard)
  async createAiAnswer(
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return await this.questionsService.createAiAnswer(+id, content);
  }

  @Post('ai-answer/:id/feedback')
  @UseGuards(JwtAuthGuard)
  async updateAiFeedback(
    @Param('id') id: string,
    @Body('feedbackPoint') feedbackPoint: number,
  ) {
    return await this.questionsService.updateAiFeedback(+id, feedbackPoint);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateAiFeedbackDto } from './dto/update-ai-feedback.dto';
import { QuestionsService } from './questions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('questions')
@ApiBearerAuth('accessToken')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    return await this.questionsService.create(createQuestionDto, req.user.id);
  }

  @Public()
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
  async createAiAnswer(@Param('id') id: string) {
    return await this.questionsService.createAiAnswer(+id);
  }

  @Patch(':id/ai-answer/feedback')
  @UseGuards(JwtAuthGuard)
  async updateAiFeedback(
    @Param('id') id: string,
    @Body() updateAiFeedbackDto: UpdateAiFeedbackDto,
  ) {
    return await this.questionsService.updateAiFeedback(
      +id,
      updateAiFeedbackDto.feedbackPoint,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.questionsService.delete(+id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateAiFeedbackDto } from './dto/update-ai-feedback.dto';
import { QuestionsService } from './questions.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('questions')
@ApiBearerAuth('accessToken')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createQuestionDto.image = file;
    }
    return await this.questionsService.create(createQuestionDto, req.user.id);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.questionsService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMyQuestions(@Request() req) {
    return await this.questionsService.findByAuthorId(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.findOne(id);
  }

  @Post(':id/ai-answer')
  @UseGuards(JwtAuthGuard)
  async createAiAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.createAiAnswer(id);
  }

  @Patch(':id/ai-answer/feedback')
  @UseGuards(JwtAuthGuard)
  async updateAiFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAiFeedbackDto: UpdateAiFeedbackDto,
  ) {
    return await this.questionsService.updateAiFeedback(
      id,
      updateAiFeedbackDto.feedbackPoint,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.delete(id);
  }
}

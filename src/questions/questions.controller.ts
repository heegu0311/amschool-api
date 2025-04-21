import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateAiFeedbackDto } from './dto/update-ai-feedback.dto';
import { QuestionsService } from './questions.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Question } from './entities/question.entity';
import { S3Service } from '../common/services/s3.service';

@ApiTags('questions')
@ApiBearerAuth('accessToken')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    if (files) {
      createQuestionDto.images = files;
    }
    const question = await this.questionsService.create(
      createQuestionDto,
      req.user.id,
    );
    return this.questionsService.findOne(question.id);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Question>> {
    return await this.questionsService.findAll(paginationDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findMyQuestions(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Question>> {
    return await this.questionsService.findByAuthorId(
      req.user.id,
      paginationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const question = await this.questionsService.findOne(+id);

    // 이미지에 대한 presigned URL 생성
    if (question.images.length > 0) {
      for (const image of question.images) {
        image.url = await image.getPresignedUrl(this.s3Service);
      }
    }

    return question;
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

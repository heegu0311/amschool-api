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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { S3Service } from '../common/services/s3.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateAiFeedbackDto } from './dto/update-ai-feedback.dto';
import { AiAnswer } from './entities/ai-answer.entity';
import { Question } from './entities/question.entity';
import { QuestionsService } from './questions.service';

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
  @ApiOperation({ summary: '새로운 질문 생성' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateQuestionDto,
  })
  @ApiResponse({
    status: 201,
    description: '질문 생성 성공',
    type: Question,
  })
  async create(
    @Request() req,
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    if (images) {
      createQuestionDto.images = images;
    }
    const question = await this.questionsService.create(
      createQuestionDto,
      req.user.id,
    );
    return this.questionsService.findOne(question.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '모든 질문 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
  })
  @ApiResponse({
    status: 200,
    description: '질문 목록 조회 성공',
    type: [Question],
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Question>> {
    return await this.questionsService.findAll(paginationDto);
  }

  @Get('my')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 질문 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
  })
  @ApiResponse({
    status: 200,
    description: '내 질문 목록 조회 성공',
    type: [Question],
  })
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
  @ApiOperation({ summary: '특정 질문 조회' })
  @ApiResponse({
    status: 200,
    description: '질문 조회 성공',
    type: Question,
  })
  @ApiResponse({
    status: 404,
    description: '질문을 찾을 수 없음',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const question = await this.questionsService.findOne(id);

    // 이미지에 대한 presigned URL 생성
    if (question.images.length > 0) {
      for (const image of question.images) {
        image.url = await image.getPresignedUrl(this.s3Service);
      }
    }

    return question;
  }

  @Get(':id/ai-answer')
  @ApiOperation({ summary: '질문의 AI 답변 조회' })
  @ApiResponse({
    status: 200,
    description: 'AI 답변 조회 성공',
    type: AiAnswer,
  })
  @ApiResponse({
    status: 404,
    description: 'AI 답변을 찾을 수 없음',
  })
  async findAiAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.findAiAnswer(id);
  }

  @Post(':id/ai-answer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '질문에 대한 AI 답변 생성' })
  @ApiResponse({
    status: 201,
    description: 'AI 답변 생성 성공',
    type: AiAnswer,
  })
  @ApiResponse({
    status: 404,
    description: '질문을 찾을 수 없음',
  })
  async createAiAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.createAiAnswer(id);
  }

  @Patch(':id/ai-answer/feedback')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'AI 답변에 대한 피드백 업데이트' })
  @ApiResponse({
    status: 200,
    description: '피드백 업데이트 성공',
    type: AiAnswer,
  })
  @ApiResponse({
    status: 404,
    description: 'AI 답변을 찾을 수 없음',
  })
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
  @ApiOperation({ summary: '질문 삭제' })
  @ApiResponse({
    status: 200,
    description: '질문 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '질문을 찾을 수 없음',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.delete(id);
  }
}

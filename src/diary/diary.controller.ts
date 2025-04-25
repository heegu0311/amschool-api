import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  ApiTags,
} from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Diary } from './entities/diary.entity';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { S3Service } from '../common/services/s3.service';

@ApiTags('diary')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '새로운 오늘의나 생성' })
  @ApiBody({ type: CreateDiaryDto })
  @ApiResponse({
    status: 201,
    description: '오늘의나 생성 성공',
    type: Diary,
  })
  async create(
    @Request() req,
    @Body() createDiaryDto: CreateDiaryDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    // emotionId와 subEmotionId를 숫자로 변환
    if (typeof createDiaryDto.emotionId === 'string') {
      createDiaryDto.emotionId = parseInt(createDiaryDto.emotionId, 10);
    }
    if (typeof createDiaryDto.subEmotionId === 'string') {
      createDiaryDto.subEmotionId = parseInt(createDiaryDto.subEmotionId, 10);
    }

    const diary = await this.diaryService.create(
      req.user.id,
      createDiaryDto,
      images,
    );
    return this.diaryService.findOne(diary.id, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: '오늘의나 목록 조회' })
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
    description: '오늘의나 목록 조회 성공',
    type: [Diary],
  })
  findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.diaryService.findAll(req.user.id, paginationDto);
  }

  @Get('similar-user')
  @ApiOperation({
    summary: '유사한 암을 가진 사용자들의 오늘의나 목록 조회',
    description:
      '현재 사용자와 같은 암을 가진 다른 사용자들의 오늘의나 목록을 조회합니다.',
  })
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
    description: '유사 사용자 오늘의나 목록 조회 성공',
    type: [Diary],
  })
  async findSimilarUserDiaries(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Diary>> {
    return await this.diaryService.findSimilarUserDiaries(
      req.user.id,
      paginationDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 오늘의나 조회' })
  @ApiResponse({
    status: 200,
    description: '오늘의나 조회 성공',
    type: Diary,
  })
  @ApiResponse({
    status: 404,
    description: '오늘의나를 찾을 수 없음',
  })
  findOne(@Request() req, @Param('id') id: string) {
    return this.diaryService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '오늘의나 수정' })
  @ApiBody({ type: UpdateDiaryDto })
  @ApiResponse({
    status: 200,
    description: '오늘의나 수정 성공',
    type: Diary,
  })
  @ApiResponse({
    status: 404,
    description: '오늘의나를 찾을 수 없음',
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDiaryDto: UpdateDiaryDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    const diary = await this.diaryService.update(
      +id,
      req.user.id,
      updateDiaryDto,
      images,
    );
    return this.diaryService.findOne(diary.id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '오늘의나 삭제' })
  @ApiResponse({
    status: 200,
    description: '오늘의나 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '오늘의나를 찾을 수 없음',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.diaryService.remove(+id, req.user.id);
  }

  @Get('monthly/:year/:month')
  @ApiOperation({ summary: '월별 오늘의나 조회' })
  @ApiResponse({
    status: 200,
    description: '월별 오늘의나 조회 성공',
    type: [Diary],
  })
  findByMonth(
    @Request() req,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.diaryService.findByMonth(
      req.user.id,
      parseInt(year),
      parseInt(month),
    );
  }
}

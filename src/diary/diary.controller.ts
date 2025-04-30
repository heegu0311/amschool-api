import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
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
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';

@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '새로운 오늘의나 생성' })
  @ApiBody({ type: CreateDiaryDto })
  @ApiResponse({
    status: 201,
    description: '오늘의나 생성 성공',
    type: Diary,
  })
  async create(
    @Body() createDiaryDto: CreateDiaryDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.diaryService.create(userId, createDiaryDto, files.images);
  }

  @Get()
  @Public()
  @ApiBearerAuth('accessToken')
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
    return this.diaryService.findAllWithMoreInfo(paginationDto, req.user?.id);
  }

  @Get('similar-user')
  @ApiBearerAuth('accessToken')
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
  @Public()
  @ApiBearerAuth('accessToken')
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
    return this.diaryService.findOneWithMoreInfo(+id, req.user?.id);
  }

  @Patch(':id')
  @ApiBearerAuth('accessToken')
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
    return this.diaryService.findOne(diary!.id, req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth('accessToken')
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
  @ApiBearerAuth('accessToken')
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

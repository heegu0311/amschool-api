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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
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

@ApiTags('diary')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @ApiOperation({ summary: '일기 생성' })
  @ApiBody({ type: CreateDiaryDto })
  @ApiResponse({
    status: 201,
    description: '일기가 성공적으로 생성됨',
    type: Diary,
  })
  create(@Request() req, @Body() createDiaryDto: CreateDiaryDto) {
    return this.diaryService.create(req.user.id, createDiaryDto);
  }

  @Get()
  @ApiOperation({ summary: '일기 목록 조회' })
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
    description: '일기 목록 조회 성공',
    type: [Diary],
  })
  findAll(@Request() req, @Query() paginationDto: PaginationDto) {
    return this.diaryService.findAll(req.user.id, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 일기 조회' })
  @ApiResponse({
    status: 200,
    description: '일기 조회 성공',
    type: Diary,
  })
  findOne(@Request() req, @Param('id') id: string) {
    return this.diaryService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '일기 수정' })
  @ApiBody({ type: UpdateDiaryDto })
  @ApiResponse({
    status: 200,
    description: '일기 수정 성공',
    type: Diary,
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ) {
    return this.diaryService.update(+id, req.user.id, updateDiaryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '일기 삭제' })
  @ApiResponse({
    status: 200,
    description: '일기 삭제 성공',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.diaryService.remove(+id, req.user.id);
  }

  @Get('monthly/:year/:month')
  @ApiOperation({ summary: '월별 일기 조회' })
  @ApiResponse({
    status: 200,
    description: '월별 일기 조회 성공',
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

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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('diary')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  create(@Request() req, @Body() createDiaryDto: CreateDiaryDto) {
    return this.diaryService.create(req.user.id, createDiaryDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.diaryService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.diaryService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDiaryDto: UpdateDiaryDto,
  ) {
    return this.diaryService.update(+id, req.user.id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.diaryService.remove(+id, req.user.id);
  }

  @Get('monthly/:year/:month')
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

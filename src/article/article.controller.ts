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
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { S3Service } from '../common/services/s3.service';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@ApiBearerAuth('accessToken')
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({
    summary: '새로운 기사 생성',
    description: '새로운 기사를 생성합니다. 이미지 파일을 포함할 수 있습니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateArticleDto,
    description: '기사 생성에 필요한 정보',
  })
  @ApiResponse({
    status: 201,
    description: '기사가 성공적으로 생성되었습니다.',
    type: Article,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청입니다.',
  })
  async create(
    @Request() req,
    @Body() createArticleDto: CreateArticleDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    if (images) {
      createArticleDto.images = images;
    }
    const article = await this.articleService.create(
      createArticleDto,
      req.user.id,
    );
    return this.articleService.findOne(article.id);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: '모든 기사 목록 조회',
    description: '페이지네이션을 지원하는 기사 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수 (기본값: 10)',
  })
  @ApiResponse({
    status: 200,
    description: '기사 목록이 성공적으로 조회되었습니다.',
    type: [Article],
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Article>> {
    return await this.articleService.findAll(paginationDto);
  }

  @Get('my')
  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '내 기사 목록 조회',
    description: '현재 로그인한 사용자가 작성한 기사 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수 (기본값: 10)',
  })
  @ApiResponse({
    status: 200,
    description: '내 기사 목록이 성공적으로 조회되었습니다.',
    type: [Article],
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청입니다.',
  })
  async findMyArticles(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Article>> {
    return await this.articleService.findByAuthorId(req.user.id, paginationDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 기사 조회',
    description: 'ID를 기반으로 특정 기사의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: '조회할 기사의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '기사가 성공적으로 조회되었습니다.',
    type: Article,
  })
  @ApiResponse({
    status: 404,
    description: '요청한 ID의 기사를 찾을 수 없습니다.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = await this.articleService.findOne(id);

    if (article.images.length > 0) {
      for (const image of article.images) {
        image.filePath = await image.getPresignedUrl(this.s3Service);
      }
    }

    return article;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({
    summary: '기사 수정',
    description:
      '기존 기사의 정보를 수정합니다. 이미지 파일을 포함할 수 있습니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: '수정할 기사의 ID',
  })
  @ApiBody({
    type: UpdateArticleDto,
    description: '수정할 기사 정보',
  })
  @ApiResponse({
    status: 200,
    description: '기사가 성공적으로 수정되었습니다.',
    type: Article,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청입니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '수정할 기사를 찾을 수 없습니다.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    if (images) {
      updateArticleDto.images = images;
    }
    return await this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '기사 삭제',
    description: '특정 기사를 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: '삭제할 기사의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '기사가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 요청입니다.',
  })
  @ApiResponse({
    status: 404,
    description: '삭제할 기사를 찾을 수 없습니다.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.delete(id);
  }

  @Get('section/:sectionSecondaryCode')
  @Public()
  @ApiOperation({
    summary: '특정 섹션의 암매거진 목록 조회',
    description:
      '섹션 코드를 기반으로 암매거진 목록을 페이지네이션하여 조회합니다.',
  })
  @ApiParam({
    name: 'sectionSecondaryCode',
    required: true,
    type: String,
    description: '섹션 코드',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호 (기본값: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수 (기본값: 10)',
  })
  @ApiResponse({
    status: 200,
    description: '암매거진 목록이 성공적으로 조회되었습니다.',
  })
  async getArticlesBySection(
    @Param('sectionSecondaryCode') sectionSecondaryCode: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.articleService.findBySectionSecondaryCode(
      sectionSecondaryCode,
      paginationDto,
    );
  }

  @Get('section/:sectionSecondaryCode/recommend')
  @Public()
  @ApiOperation({ summary: '특정 섹션의 랜덤 추천 기사 조회' })
  @ApiParam({
    name: 'sectionSecondaryCode',
    required: true,
    type: String,
    description: '섹션 코드',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '추천받을 기사 수 (기본값: 3)',
  })
  @ApiResponse({
    status: 200,
    description: '랜덤 추천 기사 조회 성공',
  })
  async getRecommendedArticles(
    @Param('sectionSecondaryCode') sectionSecondaryCode: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 3,
  ) {
    const result = await this.articleService.findRandomBySectionSecondaryCode(
      sectionSecondaryCode,
      limit,
    );
    return {
      success: true,
      data: result,
    };
  }
}

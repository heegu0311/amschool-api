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
import { JwtService } from '@nestjs/jwt';
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
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { S3Service } from '../common/services/s3.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostPaginationDto } from './dto/post-pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly s3Service: S3Service,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '새로운 게시글 생성' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: '게시글 생성 성공',
    type: PostEntity,
  })
  async create(
    @Req() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
  ) {
    if (files.images) {
      createPostDto.images = files.images;
    }
    const userId = req.user.id;
    return this.postService.create(userId, createPostDto, files.images);
  }

  @Get()
  @Public()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '게시글 목록 조회' })
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
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: '검색 키워드',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 목록 조회 성공',
    type: [PostEntity],
  })
  findAll(@Request() req, @Query() paginationDto: PostPaginationDto) {
    return this.postService.findAllWithMoreInfo(paginationDto);
  }

  @Get('popular')
  @Public()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '지난 1주일간 인기 게시글(조회수순) 10개 조회' })
  @ApiResponse({
    status: 200,
    description: '인기 게시글 목록',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', description: '게시글 ID' },
          title: { type: 'string', description: '제목' },
          viewCount: { type: 'number', description: '조회수' },
          commentsCount: { type: 'number', description: '댓글 수' },
          createdAt: { type: 'string', description: '작성일자' },
        },
      },
    },
  })
  async getPopularPosts() {
    return this.postService.findPopularPostsOfWeek();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '내 게시글 목록 조회' })
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
    description: '내 게시글 목록 조회 성공',
    type: [PostEntity],
  })
  async findMyPosts(
    @Request() req,
    @Query() paginationDto: PostPaginationDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    const userId = req.user.id;

    return await this.postService.findByAuthorId(userId, paginationDto);
  }

  @Get('sitemap')
  @Public()
  @ApiOperation({
    summary: '사이트맵용 게시글 ID 목록 조회',
    description:
      '사이트맵 생성에 필요한 모든 게시글의 ID, 제목, 생성일을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사이트맵용 게시글 목록이 성공적으로 조회되었습니다.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          title: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  async findAllIds(): Promise<
    { id: number; title: string; createdAt: Date }[]
  > {
    return await this.postService.findAllIds();
  }

  // 조회수 증가 없이 게시글 정보만 반환
  @Get(':id/basic')
  @Public()
  async findOneBasic(@Request() req, @Param('id') id: string) {
    let userId: number | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            ignoreExpiration: true,
          });
          userId = payload.sub || payload.id;
        } catch (err) {
          // 유효하지 않은 토큰(만료 등)은 무시
          console.log(err);
        }
      }
    }
    return this.postService.findOneBasic(+id, userId);
  }

  // SSR prefetch에서만 사용: 조회수 증가 O
  @Get(':id')
  @ApiOperation({ summary: '특정 게시글 조회 (조회수 증가)' })
  @ApiResponse({
    status: 200,
    description: '게시글 조회 성공',
    type: PostEntity,
  })
  @ApiResponse({
    status: 404,
    description: '게시글를 찾을 수 없음',
  })
  @Public()
  findOne(@Request() req, @Param('id') id: string) {
    return this.postService.findOneWithMoreInfo(+id, req.user?.id);
  }

  @Get('user/:userId')
  @Public()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 사용자의 게시물 목록 조회' })
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
    description: '특정 사용자의 게시물 목록 조회 성공',
    type: [PostEntity],
  })
  async findUserPosts(
    @Param('userId') userId: string,
    @Query() paginationDto: PostPaginationDto,
  ): Promise<PaginatedResponse<PostEntity>> {
    return await this.postService.findByAuthorId(+userId, paginationDto);
  }

  @Patch(':id')
  @ApiBearerAuth('accessToken')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '게시글 수정' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: '게시글 수정 성공',
    type: PostEntity,
  })
  @ApiResponse({
    status: 404,
    description: '게시글를 찾을 수 없음',
  })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    const post = await this.postService.update(
      +id,
      req.user.id,
      updatePostDto,
      images,
    );
    return this.postService.findOne(post!.id, req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiResponse({
    status: 200,
    description: '게시글 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '게시글를 찾을 수 없음',
  })
  remove(@Request() req, @Param('id') id: string) {
    return this.postService.remove(+id, req.user.id);
  }
}

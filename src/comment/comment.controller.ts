import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@UseGuards(JwtAuthGuard)
@Controller(':entityType/:entityId/comments')
@ApiBearerAuth('accessToken')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
  @ApiResponse({ status: 201, description: '댓글 생성 성공', type: Comment })
  @ApiResponse({ status: 404, description: '엔티티를 찾을 수 없음' })
  create(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.commentService.create(
      userId,
      entityType,
      entityId,
      createCommentDto,
    );
  }

  @Get()
  @ApiOperation({ summary: '엔티티의 댓글 목록 조회' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
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
    description: '댓글 목록 조회 성공',
    type: [Comment],
  })
  findAllByEntityId(
    @Param('entityId', ParseIntPipe) entityId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Comment>> {
    return this.commentService.findAllByEntityId(entityId, paginationDto);
  }

  @Delete(':commentId')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
  @ApiParam({ name: 'commentId', description: '삭제할 댓글 ID', example: 1 })
  @ApiResponse({ status: 200, description: '댓글 삭제 성공' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없음' })
  remove(
    @Param('entityId', ParseIntPipe) entityId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.commentService.remove(userId, commentId);
  }
}

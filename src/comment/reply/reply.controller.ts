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
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Reply } from './entities/reply.entity';
import { ReplyService } from './reply.service';
import { EntityType } from '../entities/comment.entity';

@UseGuards(JwtAuthGuard)
@Controller(':entityType/:entityId/comments/:commentId/replies')
@ApiBearerAuth('accessToken')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  @ApiOperation({ summary: '답글 생성' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
  @ApiParam({ name: 'commentId', description: '댓글 ID', example: 1 })
  @ApiResponse({ status: 201, description: '답글 생성 성공', type: Reply })
  @ApiResponse({ status: 404, description: '엔티티를 찾을 수 없음' })
  create(
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() createReplyDto: CreateReplyDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.replyService.create(
      userId,
      entityType,
      entityId,
      commentId,
      createReplyDto,
    );
  }

  @Get()
  @ApiOperation({ summary: '댓글의 답글 목록 조회' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
  @ApiParam({ name: 'commentId', description: '댓글 ID', example: 1 })
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
    description: '답글 목록 조회 성공',
    type: [Reply],
  })
  findAllByCommentId(
    @Req() req,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Reply>> {
    const userId = req.user.id;
    return this.replyService.findAllByCommentId(
      userId,
      commentId,
      paginationDto,
    );
  }

  @Delete(':replyId')
  @ApiOperation({ summary: '답글 삭제' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
  @ApiParam({ name: 'commentId', description: '댓글 ID', example: 1 })
  @ApiParam({ name: 'replyId', description: '삭제할 답글 ID', example: 1 })
  @ApiResponse({ status: 200, description: '답글 삭제 성공' })
  @ApiResponse({ status: 404, description: '답글을 찾을 수 없음' })
  remove(
    @Param('entityId', ParseIntPipe) entityId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('replyId', ParseIntPipe) replyId: number,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.replyService.remove(userId, replyId);
  }

  @Patch(':replyId')
  @ApiOperation({ summary: '답글 수정' })
  @ApiParam({
    name: 'entityType',
    description: '엔티티 타입 (diary, question 등)',
    example: 'diary',
  })
  @ApiParam({ name: 'entityId', description: '엔티티 ID', example: 1 })
  @ApiParam({ name: 'commentId', description: '댓글 ID', example: 1 })
  @ApiParam({ name: 'replyId', description: '수정할 답글 ID', example: 1 })
  @ApiResponse({ status: 200, description: '답글 수정 성공', type: Reply })
  @ApiResponse({ status: 404, description: '답글을 찾을 수 없음' })
  update(
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body() updateReplyDto: CreateReplyDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.replyService.update(userId, replyId, updateReplyDto);
  }
}

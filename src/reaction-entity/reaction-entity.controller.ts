import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionEntityService } from './reaction-entity.service';

@ApiBearerAuth('accessToken')
@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionEntityController {
  constructor(private readonly reactionEntityService: ReactionEntityService) {}

  @ApiOperation({ summary: '모든 공감 조회' })
  @ApiResponse({ status: 200, description: '모든 공감 목록을 반환합니다.' })
  @Get()
  async findAll() {
    return this.reactionEntityService.findAll();
  }

  @ApiOperation({ summary: '특정 엔티티의 공감 조회' })
  @ApiResponse({
    status: 200,
    description: '특정 엔티티의 공감 목록을 반환합니다.',
  })
  @Get(':entityType/:entityId')
  async getReactions(
    @Param('entityType') entityType: 'diary' | 'comment' | 'reply',
    @Param('entityId') entityId: number,
    @Req() req,
  ) {
    return this.reactionEntityService.getEntityReactions(
      entityType,
      entityId,
      req.user.id,
    );
  }

  @ApiOperation({ summary: '공감 추가' })
  @ApiResponse({ status: 201, description: '새로운 공감이 생성되었습니다.' })
  @Post(':entityType/:entityId')
  async addReaction(
    @Param('entityType') entityType: 'diary' | 'comment' | 'reply',
    @Param('entityId') entityId: number,
    @Body() addReactionDto: AddReactionDto,
    @Req() req,
  ) {
    return this.reactionEntityService.addReaction(
      entityType,
      entityId,
      req.user.id,
      addReactionDto.reactionId,
    );
  }

  @ApiOperation({ summary: '공감 삭제' })
  @ApiResponse({ status: 200, description: '공감이 삭제되었습니다.' })
  @Delete(':entityType/:entityId')
  async removeReaction(
    @Param('entityType') entityType: 'diary' | 'comment' | 'reply',
    @Param('entityId') entityId: number,
    @Req() req,
  ) {
    return this.reactionEntityService.removeReaction(
      entityType,
      entityId,
      req.user.id,
    );
  }
}

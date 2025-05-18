import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Comment } from '../entities/comment.entity';
import { Reply } from './entities/reply.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';
import { ReactionEntityService } from 'src/reaction-entity/reaction-entity.service';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly reactionEntityService: ReactionEntityService,
  ) {}

  async create(
    userId: number,
    entityType: string,
    entityId: number,
    commentId: number,
    createReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    const reply = this.replyRepository.create({
      authorId: userId,
      content: createReplyDto.content,
      entityType,
      entityId,
      commentId,
    });

    return this.replyRepository.save(reply);
  }

  async findAllByCommentId(
    userId: number,
    commentId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Reply>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.replyRepository.findAndCount({
      where: { commentId },
      relations: ['comment', 'author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 답글 ID 목록 추출
    const replyIds = items.map((reply) => reply.id);

    // 여러 댓글의 공감을 한 번에 조회
    const replyReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'reply',
        replyIds,
        userId,
      );

    const replyWithReactions = items.map((reply) => {
      const replyWithReactions = {
        ...reply,
        reactions: replyReactions[reply.id]?.reactions || [],
        userReactions: replyReactions[reply.id]?.userReactions || [],
      };
      return replyWithReactions;
    });

    return {
      items: replyWithReactions,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async remove(userId: number, replyId: number): Promise<void> {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId, authorId: userId },
    });

    if (!reply) {
      throw new NotFoundException('답글을 찾을 수 없습니다.');
    }

    await this.replyRepository.softRemove(reply);
  }

  async update(
    userId: number,
    replyId: number,
    updateReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId, authorId: userId },
    });

    if (!reply) {
      throw new NotFoundException('답글을 찾을 수 없습니다.');
    }

    reply.content = updateReplyDto.content;
    return this.replyRepository.save(reply);
  }
}

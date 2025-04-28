import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Comment } from '../entities/comment.entity';
import { Reply } from './entities/reply.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/pagination.interface';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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
    commentId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Reply>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.replyRepository.findAndCount({
      where: { commentId },
      relations: ['comment'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
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
}

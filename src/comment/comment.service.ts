import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Diary } from '../diary/entities/diary.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { ReactionEntityService } from 'src/reaction-entity/reaction-entity.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly reactionEntityService: ReactionEntityService,
  ) {}

  async create(
    userId: number,
    entityType: string,
    entityId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const diary = await this.diaryRepository.findOne({
      where: { id: entityId },
    });

    if (!diary) {
      throw new NotFoundException('오늘의나를 찾을 수 없습니다.');
    }

    const comment = this.commentRepository.create({
      authorId: userId,
      content: createCommentDto.content,
      entityType,
      entityId,
    });

    return this.commentRepository.save(comment);
  }

  async findAllByEntityTypeAndEntityId(
    userId: number,
    entityType: string,
    entityId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Comment>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.commentRepository.findAndCount({
      where: { entityType, entityId, deletedAt: IsNull() },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 댓글 ID 목록 추출
    const commentIds = items.map((comment) => comment.id);

    // 여러 댓글의 공감을 한 번에 조회
    const commentReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'comment',
        commentIds,
        userId,
      );

    const commentWithReactions = items.map((comment) => {
      const commentWithReactions = {
        ...comment,
        reactions: commentReactions[comment.id]?.reactions || [],
        userReactions: commentReactions[comment.id]?.userReactions || [],
      };
      return commentWithReactions;
    });

    return {
      items: commentWithReactions,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async remove(userId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    await this.commentRepository.softRemove(comment);
  }
}

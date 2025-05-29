import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Diary } from '../diary/entities/diary.entity';
import { NotificationService } from '../notification/notification.service';
import { Post } from '../post/entities/post.entity';
import { ReactionEntityService } from '../reaction-entity/reaction-entity.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, EntityType } from './entities/comment.entity';
import { Reply } from './reply/entities/reply.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly reactionEntityService: ReactionEntityService,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    userId: number,
    entityType: EntityType,
    entityId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    let entity;
    let authorId;

    if (entityType === EntityType.DIARY) {
      entity = await this.diaryRepository.findOne({
        where: { id: entityId },
      });
      if (!entity) {
        throw new NotFoundException('오늘의나를 찾을 수 없습니다.');
      }
      authorId = entity.authorId;
    } else if (entityType === EntityType.POST) {
      entity = await this.postRepository.findOne({
        where: { id: entityId },
      });
      if (!entity) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }
      authorId = entity.authorId;
    }

    const comment = this.commentRepository.create({
      authorId: userId,
      content: createCommentDto.content,
      entityType,
      entityId,
    });

    const savedComment = await this.commentRepository.save(comment);

    // 댓글 작성자와 게시글 작성자가 다른 경우에만 알림 생성
    if (authorId !== userId) {
      await this.notificationService.create({
        type: 'comment',
        receiverUserId: authorId,
        senderUserId: userId,
        targetId: savedComment.id,
        targetType: savedComment.type as EntityType,
        entityId,
        entityType,
        isRead: false,
      });
    }

    return savedComment;
  }

  async findAllByEntityTypeAndEntityId(
    userId: number,
    entityType: EntityType,
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

    // 각 댓글의 답글 갯수 조회
    const replyCounts = await Promise.all(
      commentIds.map(async (commentId) => {
        const count = await this.replyRepository.count({
          where: { commentId, deletedAt: IsNull() },
        });
        return { commentId, count };
      }),
    );

    const commentWithReactions = items.map((comment) => {
      const commentWithReactions = {
        ...comment,
        reactions: commentReactions[comment.id]?.reactions || [],
        userReactions: commentReactions[comment.id]?.userReactions || [],
        replyCount:
          replyCounts.find((rc) => rc.commentId === comment.id)?.count || 0,
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

  async update(
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, authorId: userId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    comment.content = updateCommentDto.content;
    return this.commentRepository.save(comment);
  }
}
